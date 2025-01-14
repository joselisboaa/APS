"use client";

import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const navigateToUserGroups = () => {
    router.push("/home/user-group");
  };

  const navigateToAnswers = () => {
    router.push("/home/answers");
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Bem-vindo ao Mapeamento de Acessibilidade
      </Typography>
      <Typography variant="body1">
        Esta é a página inicial da aplicação. Aqui você pode gerenciar grupos de usuários e respostas.
      </Typography>
      <Box sx={{ marginTop: 4 }}>
        <Button variant="contained" color="primary" onClick={navigateToUserGroups} sx={{ marginRight: 2 }}>
          Gerenciar Grupos de Usuários
        </Button>
        <Button variant="contained" color="secondary" onClick={navigateToAnswers}>
          Gerenciar Respostas
        </Button>
      </Box>
    </Box>
  );
}
