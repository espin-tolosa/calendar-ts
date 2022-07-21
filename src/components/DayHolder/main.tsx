import * as StyledDay from "../../components/DayHolder/tw";
type IDayProps = {
  fullDate: string;
};

function IDayHolder({ fullDate }: IDayProps) {
  return <StyledDay.TWsizedContainer>{fullDate}</StyledDay.TWsizedContainer>;
}

//export const MemoIDayHolder = memo(IDayHolder);
export const MemoIDayHolder = IDayHolder;
