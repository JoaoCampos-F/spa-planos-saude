export default function formatName() {
  function pascalCase(name: String) {
    if (!name) return "Não Informado";

    const lowercaseWords = [
      "de",
      "da",
      "do",
      "das",
      "dos",
      "e",
      "o",
      "a",
      "os",
      "as",
      "em",
    ];

    const words = name.toLowerCase().split(" ");

    const formattedWords = words.map((word) => {
      return lowercaseWords.includes(word)
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1);
    });

    return formattedWords.join(" ");
  }

  function camalCase(name: String) {
    if (!name) return "Não Informado";

    const words = name.toLowerCase().split(" ");

    const formattedWords = words.map((word, index) => {
      if (index === 0) {
        return word;
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    });

    return formattedWords.join(" ");
  }

  function lowerCase(name: String) {
    if (!name) return "Não Informado";

    const words = name.toLowerCase();

    return words;
  }

  function upperCase(name: String) {
    if (!name) return "Não Informado";

    const words = name.toUpperCase();

    return words;
  }

  return {
    pascalCase,
    camalCase,
    lowerCase,
    upperCase,
  };
}
