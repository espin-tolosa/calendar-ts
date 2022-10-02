const filterPlaceholdersByEvent = (
  allEvents: Array<jh.event>,
  event: jh.event
) => {
  return (
    allEvents.filter(
      (placeholder) =>
        event.id === placeholder.id && placeholder.type.includes("holder")
    ) || []
  );
};

export const sendEndReferencesToPlaceholders = (
  allEvents: Array<jh.event>,
  event: jh.event,
  endRef: number
) => {
  const placeholders = filterPlaceholdersByEvent(allEvents, event);
  placeholders.forEach((placeholder) => {
    placeholder.end = String(endRef);
    //!("mutable" in placeholder) && (placeholder.mutable = {});
    //placeholder.mutable!.bubble = endRef;
  });
};
