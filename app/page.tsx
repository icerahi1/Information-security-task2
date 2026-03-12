"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { processData } from "@/lib/crypto";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideRefreshCw } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const schema = z.object({
  text: z.string().min(1, "Text is required"),
  keyStr: z.string().min(1, "Secret key can not be empty"),
  operation: z.enum(["Encrypt", "Decrypt"]),
  mode: z.enum(["ECB", "CBC", "CFB"]),
  keySize: z.coerce.number().refine((val) => [128, 192, 256].includes(val)),
});

export default function Home() {
  const [output, setOutput] = useState("");
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      operation: "Encrypt",
      mode: "CBC",
      keySize: 256,
      text: "",
      keyStr: "",
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    try {
      const result = processData(
        data.text,
        data.keyStr,
        data.operation,
        data.mode,
        data.keySize,
      );
      setOutput(result);
    } catch (error) {
      alert("Error processing data. Check key and mode.");
    }
  };

  const handleFileUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) =>
      form.setValue("text", event.target?.result as string);
    reader.readAsText(file);
  };

  const saveToFile = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download =
      form.getValues("operation") === "Encrypt"
        ? "ciphertext.txt"
        : "plaintext.txt";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">AES Web Tool</h1>
        <Button
          onClick={() => {
            setOutput("");
            form.reset();
          }}
        >
          <LucideRefreshCw />
        </Button>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="border p-5">
          <Input type="file" accept=".txt" onChange={handleFileUpload} />
          <p className="text-center">or</p>
          <Textarea
            placeholder="Enter text here..."
            {...form.register("text")}
          />
        </div>

        <Input
          type="password"
          placeholder="Secret Key"
          {...form.register("keyStr")}
        />
        <div className="flex gap-4">
          <select
            {...form.register("operation")}
            className="border p-2 rounded w-full"
          >
            <option value="Encrypt">Encrypt</option>
            <option value="Decrypt">Decrypt</option>
          </select>

          <select
            {...form.register("mode")}
            className="border p-2 rounded w-full"
          >
            <option value="ECB">ECB</option>
            <option value="CBC">CBC</option>
            <option value="CFB">CFB</option>
          </select>
          <select
            {...form.register("keySize")}
            className="border p-2 rounded w-full"
          >
            <option value="128">128-bit</option>
            <option value="192">192-bit</option>
            <option value="256">256-bit</option>
          </select>
        </div>
        <Button type="submit" className="w-full">
          Process Data
        </Button>
      </form>

      {output && (
        <div className="space-y-2 mt-4">
          <Textarea readOnly value={output} />

          <Button onClick={saveToFile} variant="secondary">
            Save to .txt File
          </Button>
        </div>
      )}
    </main>
  );
}
