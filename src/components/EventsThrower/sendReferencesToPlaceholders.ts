import { event } from "@/interfaces";

const filterPlaceholdersByEvent = (allEvents: Array<event>, event: event) => {
  return allEvents.filter((placeholder) => placeholder.id === -event.id) || [];
};

export const sendEndReferencesToPlaceholders = (
  allEvents: Array<event>,
  event: event,
  endRef: number
) => {
  const placeholders = filterPlaceholdersByEvent(allEvents, event);
  placeholders.forEach((placeholder) => {
    placeholder.end = String(endRef);
    //!("mutable" in placeholder) && (placeholder.mutable = {});
    //placeholder.mutable!.bubble = endRef;
  });
};
