"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardActions, CardContent, Typography, CircularProgress, Alert, Box } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "react-query";
import fetchRequest from "@/utils/fetchRequest";
import Cookies from "js-cookie";


interface UserGroup {
  id: string;
  text: string;
}

export default function UserGroups() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = Cookies.get("jwt") as string;

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: userGroups, isLoading } = useQuery<UserGroup[]>(
    "userGroups",
    async () => {
      const response = await fetchRequest<null, UserGroup[]>("/user-groups", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.body;
    },
    {
      onError: (error: unknown) => {
        setErrorMessage(
          `Erro ao carregar grupos: ${error instanceof Error ? error.message : "Erro desconhecido"}`
        );
      },
    }
  );

  const deleteMutation = useMutation(
    async (id: string) => {
      await fetchRequest<null, null>(`/user-groups/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    {
      onSuccess: (_, id) => {
        queryClient.setQueryData<UserGroup[]>("userGroups", (old) =>
          (old || []).filter((group) => group.id !== id)
        );        
      },
      onError: (error: unknown) => {
        setErrorMessage(
          `Erro ao excluir grupo: ${error instanceof Error ? error.message : "Erro desconhecido"}`
        );
      },
    }
  );

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
      {isLoading && (
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
        {userGroups?.map((group) => (
          <Card
            key={group.id}
            variant="outlined"
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 2 }}
          >
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
                onClick={() => deleteMutation.mutate(group.id)}
                disabled={deleteMutation.isLoading}
              >
                {deleteMutation.isLoading ? <CircularProgress size={20} /> : "Excluir"}
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
