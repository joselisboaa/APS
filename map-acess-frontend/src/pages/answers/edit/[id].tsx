import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { TextField, Button, Box, Typography, CircularProgress, Alert } from "@mui/material";
import fetchRequest from "@/utils/fetchRequest";

interface Answer {
  id: string;
  text: string;
}

export default function EditAnswer() {
  const router = useRouter();
  const { id } = router.query; // ID vindo da URL
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [text, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch da resposta específica
  useEffect(() => {
    async function fetchAnswer() {
      if (!id) return;
      try {
        setLoading(true);
        const response = await fetchRequest<null, Answer>(`/answers/${id}`, {
          method: "GET",
        });
        setAnswer(response.body);
        setContent(response.body.text); // Preencher o campo de edição
      } catch (error) {
        setErrorMessage(
          `Erro ao carregar resposta: ${error instanceof Error ? error.message : "Erro desconhecido"}`
        );
      } finally {
        setLoading(false);
      }
    }
    fetchAnswer();
  }, [id]);

  // Atualizar a resposta
  async function handleUpdate() {
    if (!id) return;
    try {
      setLoading(true);
      await fetchRequest<{ text: string }, null>(`/answers/${id}`, {
        method: "PUT",
        body: { text },
      });
      router.push("/answers"); // Redirecionar para a lista após salvar
    } catch (error) {
      setErrorMessage(
        `Erro ao atualizar resposta: ${error instanceof Error ? error.message : "Erro desconhecido"}`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ padding: 4, maxWidth: 600, margin: "0 auto" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Editar Resposta
      </Typography>
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 2 }}>
          <CircularProgress />
        </Box>
      )}
      {errorMessage && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {errorMessage}
        </Alert>
      )}
      {answer && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
        >
          <TextField
            label="Conteúdo da Resposta"
            value={text}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
            <Button
              variant="outlined"
              onClick={() => router.push("/answers")}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading || !text.trim()}
            >
              Salvar
            </Button>
          </Box>
        </form>
      )}
    </Box>
  );
}
