"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Button, TextField, Typography, CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import fetchRequest from "@/utils/fetchRequest";
import Cookies from "js-cookie";

export default function EditAnswer() {
  const [text, setText] = useState("");
  const [questionId, setQuestionId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const token = Cookies.get("jwt") as string;
  const searchParams = useSearchParams();
  const id = searchParams?.get("id");

  useEffect(() => {
    async function fetchAnswer() {
      try {
        setLoading(true);
        const response = await fetchRequest<null, { text: string; question_id: number }>(
          `/answers/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setText(response.body.text);
        setQuestionId(response.body.question_id);
      } catch (error) {
        enqueueSnackbar(
          `Erro ao carregar a resposta: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
          { variant: "error" }
        );
        router.push("/answers");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchAnswer();
  }, [id]);

  async function handleSubmit() {
    try {
      setLoading(true);
      await fetchRequest(
        `/answers/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: { text, question_id: questionId },
        }
      );

      enqueueSnackbar("Resposta atualizada com sucesso!", { variant: "success" });
      router.push("/answers");
    } catch (error) {
      enqueueSnackbar(
        `Erro ao atualizar resposta: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Editar Resposta
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
