"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, TextField, Typography, CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import fetchRequest from "@/utils/fetchRequest";
import Cookies from "js-cookie";

export default function CreateAnswer() {
  const [text, setText] = useState("");
  const [questionId, setQuestionId] = useState<number | "">("");
  const [other, setOther] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const token = Cookies.get("jwt") as string;

  async function handleSubmit() {
    try {
      setLoading(true);
      await fetchRequest(
        "/answers",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: { text, question_id: questionId, other },
        }
      );

      enqueueSnackbar("Resposta criada com sucesso!", { variant: "success" });
      router.push("/answers");
    } catch (error) {
      enqueueSnackbar(
        `Erro ao criar resposta: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Criar Resposta
      </Typography>
      <Box sx={{ display: "grid", gap: 2 }}>
        <TextField
          label="Texto da Resposta"
          value={text}
          onChange={(e) => setText(e.target.value)}
          fullWidth
        />
        <TextField
          label="ID da Pergunta"
          type="number"
          value={questionId}
          onChange={(e) => setQuestionId(Number(e.target.value) || "")}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : "Salvar"}
        </Button>
      </Box>
    </Box>
  );
}
