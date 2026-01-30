export default function generateUUID() {
  function generateShortId() {
    const makeSegment = () => {
      if (typeof crypto !== "undefined" && crypto.getRandomValues) {
        const bytes = crypto.getRandomValues(new Uint8Array(3));
        return Array.from(bytes)
          .map((b) => (b & 0x0f).toString(16))
          .join("");
      } else {
        let seg = "";
        for (let i = 0; i < 3; i++) {
          seg += Math.floor(Math.random() * 16).toString(16);
        }
        return seg;
      }
    };

    return [makeSegment(), makeSegment(), makeSegment()].join("-");
  }

  function generateLongId() {
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      );
    } else {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }
  }

  return {
    generateShortId,
    generateLongId,
  };
}
