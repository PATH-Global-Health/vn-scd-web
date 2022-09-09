import { useState, useEffect, useCallback } from 'react';
import { DropdownItemProps } from 'semantic-ui-react';
import locations from '../assets/mock/locations.json';

type Option = Pick<DropdownItemProps, 'text' | 'value'>;

type UseAddress = {
  province?: Option;
  district?: Option;
  ward?: Option;
  getProvince: (pCode: string) => string | undefined;
  getDistrict: (pCode: string, dCode: string) => string | undefined;
  getWard: (pCode: string, dCode: string, wCode: string) => string | undefined;
  setProvince: (pCode: string) => void;
  setDistrict: (pCode: string, dCode: string) => void;
  setWard: (pCode: string, dCode: string, wCode: string) => void;
  provinceOptions: Option[];
  districtOptions: Option[];
  wardOptions: Option[];
};

const provinceOptions = locations.map((p) => ({
  text: p.label,
  value: p.value,
}));

const useAddress = (
  provinceCode?: string,
  districtCode?: string,
  wardCode?: string,
): UseAddress => {
  // #region province
  const [province, setProvince] = useState<Option>();
  const setProvinceByCode = useCallback((pCode: string) => {
    const tmpProvince = locations.find((p) => p.value === pCode);
    if (tmpProvince) {
      setProvince({ text: tmpProvince.label, value: tmpProvince.value });
    } else {
      setProvince(undefined);
    }
  }, []);
  useEffect(() => {
    if (provinceCode) {
      setProvinceByCode(provinceCode);
    }
  }, [setProvinceByCode, provinceCode]);
  // #endregion

  // #region district
  const [district, setDistrict] = useState<Option>();
  const setDistrictByCode = useCallback((pCode: string, dCode: string) => {
    const tmpProvince = locations.find((p) => p.value === pCode);
    const tmpDistrict = tmpProvince?.districts.find((d) => d.value === dCode);
    if (tmpDistrict) {
      setDistrict({ text: tmpDistrict.label, value: tmpDistrict.value });
    } else {
      setDistrict(undefined);
    }
  }, []);
  useEffect(() => {
    if (provinceCode && districtCode) {
      setDistrictByCode(provinceCode, districtCode);
    }
  }, [setDistrictByCode, provinceCode, districtCode]);
  // #endregion

  // #region ward
  const [ward, setWard] = useState<Option>();
  const setWardByCode = useCallback(
    (pCode: string, dCode: string, wCode: string) => {
      const tmpProvince = locations.find((p) => p.value === pCode);
      const tmpDistrict = tmpProvince?.districts.find((d) => d.value === dCode);
      const tmpWard = tmpDistrict?.wards.find((w) => w.value === wCode);

      if (tmpWard) {
        setWard({ text: tmpWard.label, value: tmpWard.value });
      } else {
        setWard(undefined);
      }
    },
    [],
  );
  useEffect(() => {
    if (provinceCode && districtCode && wardCode) {
      setWardByCode(provinceCode, districtCode, wardCode);
    }
  }, [setWardByCode, provinceCode, districtCode, wardCode]);

  const [districtOptions, setDistrictOptions] = useState<Option[]>([]);
  useEffect(() => {
    const tmpProvince = locations.find((p) => p.value === province?.value);
    if (tmpProvince) {
      setDistrictOptions(
        tmpProvince.districts.map((d) => ({ text: d.label, value: d.value })),
      );
    } else {
      setDistrictOptions([]);
    }
  }, [province]);

  const [wardOptions, setWardOptions] = useState<Option[]>([]);
  useEffect(() => {
    const tmpProvince = locations.find((p) => p.value === province?.value);
    const tmpDistrict = tmpProvince?.districts.find(
      (d) => d.value === district?.value,
    );
    if (tmpDistrict) {
      setWardOptions(
        tmpDistrict.wards.map((w) => ({ text: w.label, value: w.value })),
      );
    } else {
      setWardOptions([]);
    }
  }, [district, province]);

  const getProvinceByCode = (pCode: string) =>
    locations.find((p) => p.value === pCode)?.label;
  const getDistrictByCode = (pCode: string, dCode: string) =>
    locations
      .find((p) => p.value === pCode)
      ?.districts.find((d) => d.value === dCode)?.label;
  const getWardByCode = (pCode: string, dCode: string, wCode: string) =>
    locations
      .find((p) => p.value === pCode)
      ?.districts.find((d) => d.value === dCode)
      ?.wards.find((w) => w.value === wCode)?.label;

  return {
    province,
    district,
    ward,
    setProvince: setProvinceByCode,
    setDistrict: setDistrictByCode,
    setWard: setWardByCode,
    getProvince: getProvinceByCode,
    getDistrict: getDistrictByCode,
    getWard: getWardByCode,
    provinceOptions,
    districtOptions,
    wardOptions,
  };
};

export default useAddress;
