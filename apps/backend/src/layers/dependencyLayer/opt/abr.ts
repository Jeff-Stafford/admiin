import { NameInformation } from '/opt/abr.types';
import axios from 'axios';

const { ABR_GUID } = process.env;
//TODO: how to handle error?
export const abrLookupByAbn = async (businessNumber: string): Promise<any> => {
  const request =
    businessNumber?.length === 9
      ? `AcnDetails.aspx?guid=${ABR_GUID}&acn=${businessNumber}`
      : `AbnDetails.aspx?guid=${ABR_GUID}&abn=${businessNumber}`;

  console.log('request: ', request);
  const companyDetails = await axios.get(
    `https://abr.business.gov.au/json/${request}`
  );
  let data = companyDetails.data.replace('callback(', '');
  data = data.slice(0, data.lastIndexOf(')'));
  console.log(`${businessNumber} data:`, data);
  const parsedData = JSON.parse(data);
  console.log('parsedData: ', parsedData);

  // Transform the data to match ABNInformation type
  const transformedData = {
    abn: parsedData.Abn,
    abnStatus: parsedData.AbnStatus,
    abnStatusEffectiveFrom: parsedData.AbnStatusEffectiveFrom,
    acn: parsedData.Acn,
    addressDate: parsedData.AddressDate || null,
    addressPostcode: parsedData.AddressPostcode || null,
    addressState: parsedData.AddressState || null,
    businessName: parsedData.BusinessName || null,
    entityName: parsedData.EntityName || null,
    entityTypeCode: parsedData.EntityTypeCode || null,
    entityTypeName: parsedData.EntityTypeName || null,
    gst: parsedData.Gst || null,
    message: parsedData.Message || null,
  };

  console.log(`${businessNumber} abr data:`, transformedData);
  return transformedData;
};

export const abrLookupByName = async (
  name: string,
  limit = 10
): Promise<any> => {
  const companyDetails = await axios.get(
    `https://abr.business.gov.au/json/MatchingNames.aspx?name=${name}&maxResults=${limit}&guid=${ABR_GUID}`
  );
  let data = companyDetails.data.replace('callback(', '');
  data = data.slice(0, data.lastIndexOf(')'));
  const parsedData = JSON.parse(data);
  console.log('parsedData: ', parsedData);
  return (
    parsedData?.Names?.map((name: NameInformation) => ({
      abn: name.Abn,
      abnStatus: name.AbnStatus,
      isCurrent: name.IsCurrent,
      name: name.Name,
      nameType: name.NameType,
      postcode: name.Postcode,
      state: name.State,
    })) ?? []
  );
};
