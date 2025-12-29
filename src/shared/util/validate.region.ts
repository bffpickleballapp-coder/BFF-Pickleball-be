const url = 'https://tinhthanhpho.com/api/v1';
export class regionDto {
  provinceCode?: string;
  wardCode?: string;
}
//get region by provinceCode and wardCode
const getRegion = async (region: regionDto): Promise<any> => {
  if (!region.provinceCode && !region.wardCode) return null;

  const queryString = new URLSearchParams(region as any).toString();
  const res = await fetch(`${url}/new-full-address?${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (res.status !== 200) return null;
  const data = await res.json();
  console.log(data);
  return data.data;
};
//validate region
export const validateRegion = async (
  regionDto: regionDto,
): Promise<boolean> => {
  if (!regionDto.provinceCode && !regionDto.wardCode) return false;
  const region = await getRegion(regionDto);
  if (!region) return false;
  if (regionDto.provinceCode && regionDto.wardCode) {
    if (region.province && region.ward) {
      if (
        region.province.code === regionDto.provinceCode &&
        region.ward.code === regionDto.wardCode
      ) {
        return true;
      }
      return false;
    }
    return false;
  } else if (regionDto.provinceCode) {
    if (region.province) {
      if (region.province.code === regionDto.provinceCode) {
        return true;
      }
      return false;
    }
    return false;
  } else if (region.ward) {
    if (region.ward.code === regionDto.wardCode) {
      return true;
    }
    return false;
  }
  return false;
};
