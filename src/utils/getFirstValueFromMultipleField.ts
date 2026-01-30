export function getFirstValueFromMultipleField(
  value: Array<string | number> = []
) {
  return value?.length > 0 ? value[0] : undefined;
}
