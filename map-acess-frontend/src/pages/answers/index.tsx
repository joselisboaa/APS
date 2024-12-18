import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Card, CardActions, CardContent, Typography, CircularProgress, Alert, Box } from "@mui/material";
import fetchRequest from "@/utils/fetchRequest";
import Cookies from "js-cookie";

interface Answer {
  id: string;
  content: string;
}

export default function Answers() {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const token = Cookies.get("jwt") as string;

  useEffect(() => {
    async function fetchAnswers() {
      try {
        setLoading(true);
        const response = await fetchRequest<null, Answer[]>("/answers", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAnswers(response.body);
      } catch (error) {
        setErrorMessage(
          `Erro ao carregar respostas: ${error instanceof Error ? error.message : "Erro desconhecido"}`
        );
      } finally {
        setLoading(false);
      }
    }
    fetchAnswers();
  }, []);

  async function handleDelete(id: string) {
    try {
      setLoading(true);
      await fetchRequest<null, null>(`/answers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Resposta removida com sucesso!");
      setAnswers((prev) => prev.filter((answer) => answer.id !== id));
    } catch (error) {
      setErrorMessage(
        `Erro ao excluir resposta: ${error instanceof Error ? error.message : "Erro desconhecido"}`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Respostas
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push("/answers/new")}
        sx={{ marginBottom: 2 }}
      >
        Criar Nova Resposta
      </Button>
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
      <Box sx={{ display: "grid", gap: 2 }}>
        {answers.map((answer) => (
          <Card key={answer.id} variant="outlined" sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 2 }}>
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h6" component="div">
                {answer.text}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="success"
                onClick={() => router.push(`/answers/edit/${answer.id}`)}
                sx={{ marginRight: 1 }}
              >
                Editar
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDelete(answer.id)}
              >
                Excluir
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
