import { Editor } from "@monaco-editor/react";
import { useState } from "react";

const FetchCode = async (id: string) => {
  const res = await fetch(
    `https://ceres.epi.it.matsue-ct.ac.jp/compile/code/${id}`,
  );
  if (!res.ok) {
    return "";
  }
  const json = await res.json();
  return decodeURIComponent(atob(json.code));
};

export const TopPage = () => {
  const [code, setCode] = useState<string>("");

  return (
    <>
      <h1>
        Kolony - <a href="https://github.com/poporonnet/kanicc">kanicc</a>{" "}
        frontend
      </h1>

      <form
        onSubmit={async (v) => {
          v.preventDefault();
          const form = new FormData(v.currentTarget);
          const a = form.get("compileID");
          if (!a) return;

          const res = await FetchCode(a as string);
          setCode(res);
        }}
      >
        <label htmlFor="codeID">取得したいコンパイルID</label>
        <input
          type="text"
          name="compileID"
          id="codeID"
          placeholder={"コンパイルID"}
        />
        <input type="submit" value="コードを取得" id="fetchCode" />
      </form>

      <Editor theme={"vs-dark"} height={"75%"} language={"ruby"} value={code} />

      <label htmlFor="sendButton">コードをアップロード</label>
      <input
        id="sendButton"
        type="submit"
        value="アップロード"
        onClick={async () => {
          const res = await fetch(
            "https://ceres.epi.it.matsue-ct.ac.jp/compile/code",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ code: btoa(code) }),
            },
          );
          if (!res.ok) {
            alert("アップロードに失敗しました");
            return;
          }

          const json = await res.json();
          // 新しいタブでリンクを開く
          window.open(
            `https://ceres.epi.it.matsue-ct.ac.jp/writer?id=${json.id}`,
            "_blank",
          );
        }}
      />
    </>
  );
};
