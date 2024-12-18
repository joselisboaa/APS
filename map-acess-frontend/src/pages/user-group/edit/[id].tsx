import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { TextField, Button, Box, Typography, CircularProgress, Alert } from "@mui/material";
import fetchRequest from "@/utils/fetchRequest";
import Cookies from "js-cookie";

interface UserGroup {
  id: string;
  text: string;
}

export default function EditUserGroup() {
  const router = useRouter();
  const { id } = router.query; // ID vindo da URL
  const [userGroup, setUserGroup] = useState<UserGroup | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch do grupo de usuário específico
  useEffect(() => {
    const auth = Cookies.get("jwt") as string;
    async function fetchUserGroup() {
      if (!id) return;
      try {
        setLoading(true);
        const response = await fetchRequest<null, UserGroup>(`/user-groups/${id}`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${auth}`
          }
        });
        setUserGroup(response.body);
        setText(response.body.text); // Preencher o campo de edição com o nome atual
      } catch (error) {
        setErrorMessage(
          `Erro ao carregar grupo: ${error instanceof Error ? error.message : "Erro desconhecido"}`
        );
      } finally {
        setLoading(false);
      }
    }
    fetchUserGroup();
  }, [id]);

  // Atualizar grupo de usuários
  async function handleUpdate() {
    if (!id) return;
    try {
      setLoading(true);
      await fetchRequest<{ text: string }, null>(`/user-group/${id}`, {
        method: "PUT",
        body: { text },
      });
      router.push("/user-group"); // Redirecionar para a lista de grupos após salvar
    } catch (error) {
      setErrorMessage(
        `Erro ao atualizar grupo: ${error instanceof Error ? error.message : "Erro desconhecido"}`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ padding: 4, maxWidth: 600, margin: "0 auto" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Editar Grupo de Usuário
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
      {userGroup && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
        >
          <TextField
            label="Nome do Grupo"
            value={text}
            onChange={(e) => setText(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
            <Button
              variant="outlined"
              onClick={() => router.push("/user-groups")}
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
