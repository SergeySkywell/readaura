export async function translateText(text: string) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    text,
  )}&langpair=en|ru`;

  const res = await fetch(url);

  const data = await res.json();

  return data.responseData.translatedText;
}
