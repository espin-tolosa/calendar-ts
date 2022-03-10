export namespace CustomTypes {
  /**
   * Template type created to store React ref to HTML DOM elements
   * which allows null values required in cases such as:
   * - before the first DOM is rendered
   * - after the component is unmounted
   */
  export type NullableRef<T> = React.RefObject<T> | null;
}
