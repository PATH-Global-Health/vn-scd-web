import React, { useEffect, useMemo, useState } from 'react';
import { Form, Modal } from 'semantic-ui-react';
import { ToastComponent } from '@app/components/toast-component/ToastComponent';
import { toast } from 'react-toastify';

import moment from 'moment';

import { useDispatch, useFetchApi, useSelector } from '@app/hooks';
import { DatePicker } from '@app/components/date-picker';

import examinationService from '../examination.service';
import { getAvailableDateForExport } from '../examination.slice';

interface Props {
  open: boolean;
  onClose: () => void;
}

const ExportExcelModal: React.FC<Props> = (props) => {
  const { open, onClose } = props;
  const [dateTaken, setDateTaken] = useState<Date>();
  const {
    selectedHospital,
    availableDateForExportList,
    getAvailableDateForExportLoading,
  } = useSelector((s) => s.csyt.examination);
  const { fetch, fetching } = useFetchApi();
  const dispatch = useDispatch();
  useEffect(() => {
    if (selectedHospital) {
      dispatch(getAvailableDateForExport(selectedHospital.id));
    }
  }, [dispatch, selectedHospital]);

  const disabled = useMemo(() => !dateTaken, [dateTaken]);

  const handleSubmit = async () => {
    try {
      if (selectedHospital && dateTaken) {
        // await fetch(

        await examinationService.exportExamReport(selectedHospital.id, dateTaken);
        onClose();
        toast(
          <ToastComponent
            content="Xuất báo cáo thành công"
            type="success"
          />,
        );
      }

      // );

    }
    catch (error) {
      toast(
        <ToastComponent
          content="Không có mẫu"
          type="failed"
        />,
      );
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Modal.Header>Xuất báo cáo</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleSubmit}>
            <Form.Group widths="equal">
              <Form.Field
                label="Ngày lấy mẫu"
                control={DatePicker}
                onChange={setDateTaken}
                loading={getAvailableDateForExportLoading}
                disabled={getAvailableDateForExportLoading}
                disabledDays={(d: Date) =>
                  !(availableDateForExportList.length === 0
                    ? []
                    : availableDateForExportList
                  )
                    .map((ad) => moment(ad).format('YYYY-MM-DD'))
                    .includes(moment(d).format('YYYY-MM-DD'))
                }
              />
            </Form.Group>
            <Form.Button
              primary
              disabled={disabled || fetching}
              loading={fetching}
              content="Xác nhận"
            />
          </Form>
        </Modal.Content>
      </Modal>
    </>
  );
};

export default ExportExcelModal;
