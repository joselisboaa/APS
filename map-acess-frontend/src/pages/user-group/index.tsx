import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Card, CardActions, CardContent, Typography, CircularProgress, Alert, Box } from "@mui/material";
import fetchRequest from "@/utils/fetchRequest";
import Cookies from "js-cookie";

interface UserGroup {
  id: string;
  text: string;
}

export default function UserGroups() {
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const token = Cookies.get("jwt") as string;

  
  useEffect(() => {
    console.log(token)
    async function fetchUserGroups() {
      try {
        setLoading(true);
        const response = await fetchRequest<null, UserGroup[]>("/user-groups", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserGroups(response.body);
      } catch (error) {
        setErrorMessage(
          `Erro ao carregar grupos: ${error instanceof Error ? error.message : "Erro desconhecido"}`
        );
      } finally {
        setLoading(false);
      }
    }
    fetchUserGroups();
  }, []);

  async function handleDelete(id: string) {
    try {
      setLoading(true);
      await fetchRequest<null, null>(`/user-groups/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("grupo de usuário removido com sucesso!");
      setUserGroups((prev) => prev.filter((group) => group.id !== id));
    } catch (error) {
      setErrorMessage(
        `Erro ao excluir grupo: ${error instanceof Error ? error.message : "Erro desconhecido"}`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Grupos de Usuários
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push("/user-groups/new")}
        sx={{ marginBottom: 2 }}
      >
        Criar Novo Grupo
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
        {userGroups.map((group) => (
          <Card key={group.id} variant="outlined" sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 2 }}>
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h6" component="div">
                {group.text}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="success"
                onClick={() => router.push(`/user-groups/edit/${group.id}`)}
                sx={{ marginRight: 1 }}
              >
                Editar
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDelete(group.id)}
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
