import { WBBox, WBIcon, WBTooltip } from '../..';

export interface InformationIconProps {
  title?: string;
}

export function InformationIcon({ title }: InformationIconProps) {
  const hasInfoIcon = title ? true : false;

  return hasInfoIcon ? (
    <WBTooltip title={title}>
      <WBBox component="span" sx={{ cursor: 'pointer' }}>
        <WBIcon
          size={2}
          library="ioniconSharp"
          name="InformationCircle"
        ></WBIcon>
      </WBBox>
    </WBTooltip>
  ) : null;
}

export default InformationIcon;
