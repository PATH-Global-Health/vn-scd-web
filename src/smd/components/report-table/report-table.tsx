/* eslint-disable @typescript-eslint/unbound-method */
import locations from '@app/assets/mock/locations.json';
import DataTable, { Column } from '@app/components/data-table';
import SimpleForm from '@app/components/simple-form';
import {
  useAuth,
  useConfirm,
  useDispatch,
  useError,
  useSelector,
} from '@app/hooks';
import { FormField } from '@app/models/form-field';
import { apiLinks, httpClient } from '@app/utils';
import { toMonth, toYear } from '@app/utils/helpers';
import { unwrapResult } from '@reduxjs/toolkit';
import {
  AllowImportType,
  CBO,
  ImportType,
  Indicator,
  Project,
  ReadType,
  Report,
} from '@smd/models';
import { getCBOs, getCBOsByToken, getInfo } from '@smd/redux/cbo';
import { getIndicators } from '@smd/redux/indicator';
import { getProjectByToken, getProjects } from '@smd/redux/project';
import {
  clearImportError,
  createReport,
  deleteReport,
  getReports,
  importReport,
  updateReport,
} from '@smd/redux/report';
import { getPackages } from '@smd/redux/smd-package';
import moment from 'moment';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FiClock, FiEdit3, FiPlus, FiTrash2, FiUpload } from 'react-icons/fi';
import {
  Button,
  Checkbox,
  Form,
  Header,
  Icon,
  Input,
  Message,
  Modal,
  Table,
} from 'semantic-ui-react';
import { DashboardFilter } from '../dashboard';
import { Filter } from '../dashboard/DashboardFilter';

interface IndicatorMap {
  packageCode: string | undefined;
  id: string;
  type: number;
  indicatorId: Indicator['id'];
  indicatorName: Indicator['name'];
  value: number;
}
interface Props {
  onSelect: (data: Report) => void;
}

const ReportTable: React.FC<Props> = ({ onSelect }) => {
  const error = useError();
  const confirm = useConfirm();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { isAdmin, isProject } = useAuth();

  const getLoading = useSelector((s) => s.smd.report.getReportsLoading);
  const createLoading = useSelector((s) => s.smd.report.createReportLoading);
  const updateLoading = useSelector((s) => s.smd.report.updateReportLoading);
  const deleteLoading = useSelector((s) => s.smd.report.deleteReportLoading);
  const importLoading = useSelector((s) => s.smd.report.importReportLoading);
  const importError = useSelector((s) => s.smd.report.importError);
  const { data, pageCount } = useSelector((s) => s.smd.report.reportData);
  const { data: indicatorOptions } = useSelector(
    (s) => s.smd.indicator.indicatorData,
  );
  const { data: packageOptions } = useSelector(
    (s) => s.smd.smdPackage.sMDPackageData,
  );

  const projectInfo = useSelector((s) => s.smd.project.projectInfo);
  const cboInfo = useSelector((s) => s.smd.cbo.cboInfo);
  const { data: cboList } = useSelector((s) => s.smd.cbo.cboByToken);

  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [modal, setModal] = useState(false);
  const [filter, setFilter] = useState<Filter>();
  const [selecting, setSelecting] = useState<Report>();

  const getData = useCallback(() => {
    dispatch(getReports({ ...filter, pageIndex, pageSize }));
  }, [dispatch, pageIndex, pageSize, filter]);

  useEffect(getData, [getData]);

  useEffect(() => {
    if (isProject) {
      dispatch(getProjectByToken());
      dispatch(getCBOsByToken({ pageIndex: 0, pageSize: 1000 }));
    } else {
      dispatch(getInfo());
    }
    dispatch(getIndicators());
    dispatch(getPackages({ pageIndex: 0, pageSize: 1000 }));
  }, [isProject, dispatch]);

  const [projects, setProjects] = useState<Project[]>([]);
  const [cbos, setCbos] = useState<CBO[]>([]);
  useEffect(() => {
    const getBaseData = async () => {
      const arg = { pageSize: 1000, pageIndex: 0 };
      const p = unwrapResult(await dispatch(getProjects(arg)));
      setProjects(p.data);
      const c = unwrapResult(
        await dispatch(getCBOs({ ...arg, isGetAll: true })),
      );
      setCbos(c.data);
    };
    getBaseData();
  }, [dispatch]);

  const columns = useMemo(
    (): Column<Report>[] => [
      {
        header: t('Indicator'),
        accessor: 'indicatorId',
        render: (d) =>
          t(
            `${
              indicatorOptions.find((e) => e.id === d.indicatorId)?.name ?? ''
            }`,
          ),
      },
      {
        header: t('Period'),
        accessor: 'period',
        render: ({ period }) =>
          period === 0 || period.toString() === 'MONTH'
            ? t('Month')
            : t('Quarter'),
      },
      {
        header: t('Month'),
        accessor: 'id',
        render: ({ dateTime }) => toMonth(dateTime),
      },
      {
        header: t('Year'),
        accessor: 'dateTime',
        render: ({ dateTime }) => toYear(dateTime),
      },
      {
        header: t('Province/City'),
        accessor: 'province',
        render: ({ province }) =>
          locations.find((p) => p.value === province)?.label ?? '',
      },
      {
        header: t('CBO'),
        accessor: 'cboName',
      },
      {
        header: t('Package'),
        accessor: 'packageCode',
      },
      { header: t('Value'), accessor: 'value' },
    ],
    [indicatorOptions, t],
  );

  const allowInputType = useMemo(() => {
    let a = 0;
    if (isProject) {
      if (projectInfo?.allowInputType == 'AGRREGATE') {
        return 0;
      }
    } else {
      a = cboInfo?.allowInputType ?? -1;
    }
    return (a + 1) % 2;
  }, [isProject, projectInfo, cboInfo]);

  const [importType, setImportType] = useState<ImportType[]>([]);
  const [openImportModal, setOpenImportModal] = useState<boolean>(false);
  const [isDeletedOldData, setIsDeletedOldData] = useState<boolean>(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const downloadExcelTemplate = () => {
    const link = document.createElement('a');
    if (allowInputType === AllowImportType.SYSTHESIS) {
      link.href = '/excels/ReportSynthesisTemplate.xlsx';
    } else {
      link.href = '/excels/ReportRawTemplate.xlsx';
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [selectedFile, setSelectedFile] = useState<File>();
  const importFile = useCallback(() => {
    const upload = async () => {
      if (selectedFile && importType) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const isBoth =
          importType.includes(ImportType.PAYMENT) &&
          importType.includes(ImportType.RAW);

        unwrapResult(
          await dispatch(
            importReport({
              allowInputType,
              readType: isBoth ? ImportType.BOTH : importType[0],
              importByCBO: !isProject,
              forceDelete: isDeletedOldData,
              data: formData,
            }),
          ),
        );
        getData();
        setSelectedFile(undefined);
        setOpenImportModal(false);
        const f = fileRef.current;
        if (f) {
          f.value = '';
        }
      }
    };
    upload();
  }, [
    dispatch,
    allowInputType,
    selectedFile,
    getData,
    importType,
    isProject,
    isDeletedOldData,
  ]);

  useEffect(() => {
    if (importError?.errorMessage) {
      error('Import không thành công', [], importError?.errorMessage, () => {
        dispatch(clearImportError());
      });
    }
  }, [dispatch, error, importError]);

  const [indicatorMap, setIndicatorMap] = useState<IndicatorMap[]>([]);
  useEffect(() => {
    setIndicatorMap(
      indicatorOptions
        .filter((e) => e.type !== ReadType.RATE)
        .map((e) => ({
          id: '',
          indicatorId: e.id,
          indicatorName: t(`${e.name}`),
          type: e.type,
          value: 0,
          packageCode: '',
        })),
    );
  }, [t, indicatorOptions]);
  const { watch, reset, control, getValues, errors, handleSubmit } = useForm({
    defaultValues: { ...selecting },
  });

  useEffect(() => reset({ ...selecting }), [reset, selecting]);
  useEffect(() => {
    if (modal && indicatorOptions.length) {
      setIndicatorMap(
        indicatorOptions
          .filter((e) => e.type !== ReadType.RATE)
          .map((e) => ({
            id: '',
            indicatorId: e.id,
            indicatorName: t(`${e.name}`),
            type: e.type,
            value: 0,
            packageCode: '',
          })),
      );
    }
  }, [t, modal, indicatorOptions]);

  const onSubmit = async () => {
    const d = getValues() as Report;
    await Promise.all(
      indicatorMap.map((e) => {
        const fetchingData = {
          ...d,
          ...e,
          indicatorName: undefined,
          packageCode: d.packageCode,
          dateTime: moment(d.dateTime, 'YYYY-MM').format('YYYY-MM-01'),
        };
        if (e.type === ReadType.PAYMENT && !d.packageCode) {
          return null;
        }
        return dispatch(
          e.id ? updateReport(fetchingData) : createReport(fetchingData),
        );
      }),
    );
    setModal(false);
    getData();
  };

  const { province, period, unitId, dateTime } = watch();
  useEffect(() => {
    if (
      Number.isInteger(period) &&
      unitId &&
      dateTime &&
      province &&
      Number(moment(dateTime, 'YYYY-MM').format('YYYY')) > 2000
    ) {
      const getReportByFilter = async () => {
        const result = unwrapResult(
          await dispatch(
            getReports({
              reportingPeriod: period,
              dateTimes: [moment(dateTime, 'YYYY-MM').format('YYYY-MM-01')],
              psnUs: [province],
              cbOs: [unitId],
              indicators: indicatorOptions
                .filter((e) => e.type !== ReadType.RATE)
                .map((e) => e.id),
            }),
          ),
        );
        setIndicatorMap(
          indicatorOptions
            .filter((e) => e.type !== ReadType.RATE)
            .map((e) => ({
              id: result.data.find((d) => d.indicatorId === e.id)?.id ?? '',
              indicatorId: e.id,
              indicatorName: t(`${e.name}`),
              type: e.type,
              value:
                result.data.find((d) => d.indicatorId === e.id)?.value ?? 0,
              packageCode:
                result.data.find((d) => d.indicatorId === e.id)?.packageCode ??
                '',
            })),
        );
      };
      getReportByFilter();
    }
  }, [dispatch, t, period, province, unitId, dateTime, indicatorOptions]);

  const fields = useMemo(
    (): FormField<Report>[] => [
      {
        name: 'id',
        hidden: true,
      },
      {
        type: 'select',
        required: true,
        name: 'unitId',
        label: t('CBO'),
        options: cboList.map((c) => ({ value: c.id, text: c.name })),
        hidden: !isProject,
      },
      {
        type: 'select',
        required: true,
        name: 'period',
        label: t('Period'),
        options: [
          { value: 0, text: t('Month') },
          { value: 1, text: t('Quarter') },
        ],
      },
      {
        required: true,
        inputType: 'month',
        name: 'dateTime',
        label: t('Month/Year'),
      },
      {
        type: 'select',
        required: true,
        name: 'province',
        label: t('Province/City'),
        options: locations.map((p) => ({
          text: p.label,
          value: p.value,
        })),
      },
      {
        type: 'select',
        required:
          indicatorOptions.find((i) => i.id === selecting?.indicatorId)
            ?.type === ReadType.PAYMENT,
        name: 'packageCode',
        label: t('Package'),
        options: packageOptions.map((p) => ({
          text: p.name,
          value: p.code,
        })),
        hidden:
          indicatorOptions.find((i) => i.id === selecting?.indicatorId)
            ?.type !== ReadType.PAYMENT,
      },
      {
        required: true,
        name: 'value',
        label: t('Value'),
      },
    ],
    [t, cboList, isProject, packageOptions, indicatorOptions, selecting],
  );

  const onExportExcel = async (data: Filter) => {
    httpClient
      .put({
        url: (al) => al.smd.report.exportExcel,
        data: data,
        responseType: 'blob',
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `report.xlsx`);
        document.body.appendChild(link);
        link.click();
      });
  };

  return (
    <>
      <DashboardFilter
        isFilter
        cbos={cbos}
        projects={projects}
        onChange={setFilter}
        onExportExcel={onExportExcel}
      />
      <DataTable
        title={t('Report Management')}
        columns={columns}
        data={data}
        pageCount={pageCount}
        onPaginationChange={(p) => {
          setPageSize(p.pageSize);
          setPageIndex(p.pageIndex);
        }}
        loading={getLoading || deleteLoading}
        dropdownActions={[
          {
            title: t('Import'),
            icon: <FiUpload />,
            color: 'blue',
            hidden: isAdmin,
            options: [
              {
                title: t('Import Synthesis Report'),
                onClick: () => {
                  setOpenImportModal(true);
                  setImportType([ImportType.PAYMENT, ImportType.RAW]);
                },
                hidden: allowInputType === AllowImportType.RAW,
              },
              {
                title: t('Import Raw'),
                onClick: () => {
                  setOpenImportModal(true);
                  setImportType([ImportType.PAYMENT, ImportType.RAW]);
                },
                hidden: allowInputType === AllowImportType.SYSTHESIS,
              },
            ],
          },
        ]}
        tableActions={[
          {
            title: t('Add'),
            icon: <FiPlus />,
            color: 'green',
            onClick: () => {
              setModal(true);
            },
            hidden: isAdmin || allowInputType === AllowImportType.RAW,
          },
        ]}
        rowActions={[
          {
            title: t('History'),
            icon: <FiClock />,
            color: 'black',
            onClick: onSelect,
          },
          {
            title: t('Edit'),
            icon: <FiEdit3 />,
            color: 'violet',
            onClick: (d) => {
              setSelecting(d);
            },
            hidden: isAdmin,
          },
          {
            title: t('Delete'),
            icon: <FiTrash2 />,
            color: 'red',
            onClick: ({ id }) => {
              confirm(t('Confirm delete ?'), async () => {
                await dispatch(deleteReport(id));
                getData();
              });
            },
            hidden: isAdmin,
          },
        ]}
      />
      <Modal open={modal} onClose={() => setModal(false)}>
        <Modal.Header>{t(selecting ? 'Edit' : 'Create New')}</Modal.Header>
        <Modal.Content>
          <Form loading={getLoading}>
            <Header as="h4" content={t('General Information')} />
            <Controller
              name="unitId"
              defaultValue={cboInfo?.id ?? ''}
              control={control}
              rules={{ required: true }}
              render={({ onChange, onBlur, value, name }) => {
                if (!isProject) {
                  return <></>;
                }
                return (
                  <Form.Select
                    fluid
                    search
                    deburr
                    required
                    clearable
                    value={value as string}
                    label={t('CBO')}
                    options={cboList.map((c) => ({
                      value: c.id,
                      text: c.name,
                    }))}
                    onChange={(_, { value: v }) => onChange(v)}
                    onBlur={onBlur}
                    error={Boolean(errors[name]) && t('Required').toString()}
                  />
                );
              }}
            />

            <Controller
              name="period"
              defaultValue=""
              control={control}
              rules={{ required: true }}
              render={({ onChange, onBlur, value, name }) => (
                <Form.Select
                  fluid
                  search
                  deburr
                  required
                  clearable
                  value={value as string}
                  label={t('Period')}
                  options={[
                    { value: 0, text: t('Month') },
                    { value: 1, text: t('Quarter') },
                  ]}
                  onChange={(_, { value: v }) => onChange(v)}
                  onBlur={onBlur}
                  error={Boolean(errors[name]) && t('Required').toString()}
                />
              )}
            />

            <Controller
              name="dateTime"
              defaultValue=""
              control={control}
              rules={{ required: true }}
              render={({ onChange, onBlur, value, name }) => (
                <Form.Input
                  type="month"
                  required
                  label={t('Month/Year')}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value as string}
                  error={Boolean(errors[name]) && t('Required').toString()}
                />
              )}
            />

            <Controller
              name="province"
              defaultValue=""
              control={control}
              rules={{ required: true }}
              render={({ onChange, onBlur, value, name }) => (
                <Form.Select
                  fluid
                  search
                  deburr
                  required
                  clearable
                  value={value as string}
                  label={t('Province/City')}
                  options={locations.map((p) => ({
                    text: p.label,
                    value: p.value,
                  }))}
                  onChange={(_, { value: v }) => onChange(v)}
                  onBlur={onBlur}
                  error={Boolean(errors[name]) && t('Required').toString()}
                />
              )}
            />

            <Controller
              name="packageCode"
              defaultValue=""
              control={control}
              render={({ onChange, onBlur, value }) => (
                <Form.Select
                  fluid
                  search
                  deburr
                  clearable
                  label={t('Package')}
                  options={packageOptions.map((p) => ({
                    text: p.name,
                    value: p.code,
                  }))}
                  value={value as string}
                  onChange={(_, { value: v }) => onChange(v)}
                  onBlur={onBlur}
                />
              )}
            />
            <Message
              info
              content={t(
                'Please select Package if you want to create/update payment',
              )}
            />

            <Header as="h4" content={t('Indicator Information')} />
            <Table celled size="small" singleLine>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell content={t('Indicator')} />
                  <Table.HeaderCell content={t('Value')} />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {indicatorMap.map((e) => (
                  <Table.Row key={e.indicatorId}>
                    <Table.Cell>{e.indicatorName}</Table.Cell>
                    <Table.Cell>
                      <Input
                        type="number"
                        value={e.value}
                        onChange={({ target: { value } }) => {
                          setIndicatorMap((old) =>
                            old.map((idc) => {
                              if (idc.indicatorId === e.indicatorId) {
                                return {
                                  ...idc,
                                  value: Number(value),
                                };
                              }
                              return idc;
                            }),
                          );
                        }}
                      />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Form>
        </Modal.Content>

        <Modal.Actions>
          <Button
            positive
            labelPosition="right"
            icon="checkmark"
            content={t('Confirm')}
            loading={createLoading || updateLoading}
            disabled={createLoading || updateLoading}
            onClick={handleSubmit(onSubmit)}
          />
        </Modal.Actions>
      </Modal>

      <Modal
        open={Boolean(selecting)}
        onClose={() => {
          setSelecting(undefined);
          getData();
        }}
      >
        <Modal.Header>{t('Edit')}</Modal.Header>
        <Modal.Content>
          <SimpleForm
            loading={createLoading || updateLoading}
            defaultValues={selecting}
            formFields={fields}
            onSubmit={async (d) => {
              const fetchingData: Report = {
                ...d,
                unitId: cboInfo?.id ?? d.unitId ?? '',
                period: Number(d.period),
                value: Number(d.value),
                indicatorId: selecting?.indicatorId ?? '',
              };
              unwrapResult(await dispatch(updateReport(fetchingData)));

              setModal(false);
              setSelecting(undefined);
              getData();
            }}
          />
        </Modal.Content>
      </Modal>

      <Modal open={openImportModal} onClose={() => setOpenImportModal(false)}>
        <Modal.Header>
          {t(
            allowInputType === AllowImportType.RAW
              ? 'Import Raw'
              : 'Import Synthesis Report',
          )}
        </Modal.Header>
        <Modal.Content>
          <Button
            icon="upload"
            labelPosition="right"
            color="green"
            content={t('Select file')}
            onClick={() => fileRef?.current?.click()}
          />
          <Header
            as="h5"
            content={`${t('Selecting file: ')} ${selectedFile?.name ?? ''}`}
          />
          <br />
          <Checkbox
            label={t(
              allowInputType === AllowImportType.RAW
                ? 'Import Raw'
                : 'Import Synthesis Report',
            )}
            checked={importType.includes(ImportType.RAW)}
            onChange={(_, { checked }) => {
              if (checked) {
                setImportType((it) => [...it, ImportType.RAW]);
              } else {
                setImportType((it) => it.filter((e) => e !== ImportType.RAW));
              }
            }}
          />
          <Checkbox
            style={{ paddingLeft: '30px' }}
            label={t('Import Payment')}
            checked={importType.includes(ImportType.PAYMENT)}
            onChange={(_, { checked }) => {
              if (checked) {
                setImportType((it) => [...it, ImportType.PAYMENT]);
              } else {
                setImportType((it) =>
                  it.filter((e) => e !== ImportType.PAYMENT),
                );
              }
            }}
          />
          {allowInputType === AllowImportType.RAW && (
            <Checkbox
              style={{ paddingLeft: '30px' }}
              label={t('Delete imported data')}
              checked={isDeletedOldData}
              onChange={(_, { checked }) => {
                setIsDeletedOldData(checked === true);
              }}
            />
          )}
          <Message
            info
            icon
            size="mini"
            style={{ marginBottom: 0, cursor: 'pointer' }}
            onClick={downloadExcelTemplate}
          >
            <Icon name="download" />
            <Message.Content>
              <Message.Header>{t('Download template file')}</Message.Header>
            </Message.Content>
          </Message>
        </Modal.Content>
        <Modal.Actions>
          <Button
            positive
            labelPosition="right"
            icon="checkmark"
            content={t('Confirm').toString()}
            loading={importLoading}
            disabled={!selectedFile || importType.length === 0}
            onClick={importFile}
          />
        </Modal.Actions>
      </Modal>

      <input
        hidden
        required
        type="file"
        ref={fileRef}
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        onChange={(e) => {
          if (e.target !== null && e.target.files !== null) {
            setSelectedFile(e.target.files[0]);
          }
        }}
      />
    </>
  );
};

export default ReportTable;
