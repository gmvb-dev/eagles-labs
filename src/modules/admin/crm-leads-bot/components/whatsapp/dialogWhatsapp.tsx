import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  Button,
  Tooltip,
  Text,
  Flex,
  Image,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { SiWhatsapp } from "react-icons/si";
import { useGetMensagensWhatsApp } from "../../hooks/whatsapp/useGetMensagensWhatsApp";
import { usePostMensagensWhatsApp } from "../../hooks/whatsapp/usePostMensagensWhatsApp";
import { useGetInstanciasWhatsApp } from "../../hooks/whatsapp/useGetInstanciasWhatsApp";
import MensagensWhatsappComponent from "./mensagensWhatsapp";
import back from "../../images/wpp.jpg";
import user from "../../images/user.png";
import InputWhatsappConponent from "./inputWhatsapp";
import { useGetMinhaConta } from "../../../../../hooks/useGetMinhaConta";

export default function DialogWhatsappComponent({
  nome,
  idLead,
  telefone,
}: any) {
  const { data: minhaConta } = useGetMinhaConta();
  const [mensagemOut, setMensagemOut] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [carregamentoMsgs, setCarregamentoMsgs] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);
  const { data: instancias } = useGetInstanciasWhatsApp();
  const minhaInstancia =
    instancias && instancias[0] ? instancias[0].instance : null;

  const instanceOnline =
    instancias && instancias[0] ? !!instancias[0].online : false;

  const { data, isSuccess } = useGetMensagensWhatsApp(idLead, minhaInstancia);
  const blocoDeMensagens = data || [];
  const { UseRequestPostMensagensWhatsApp } = usePostMensagensWhatsApp();

  const mensagemRef = useRef<HTMLDivElement>(null);

  const enviarMensagem = () => {
    setIsLoading(true);
    const payload = {
      id_acesso: minhaConta?.idAcesso,
      idLead: idLead,
      instance: minhaInstancia,
      body: mensagemOut,
      chatId: telefone,
      type: "text",
    };
    UseRequestPostMensagensWhatsApp(payload);
    setMensagemOut("");

    if (isSuccess) {
      setTimeout(() => {
        setIsLoading(false);
      }, 2500);
    }
  };

  const carregarMenagens = () => {
    if (!instanceOnline) {
      onClose();
      return;
    }

    setCarregamentoMsgs(true);
    onOpen();
    setTimeout(() => {
      setCarregamentoMsgs(false);
    }, 5000);
  };

  useEffect(() => {
    if (!instanceOnline) {
      carregarMenagens();
    }
  }, [instanceOnline]);

  useEffect(() => {
    if (isOpen && mensagemRef.current && !carregamentoMsgs) {
      mensagemRef.current.scrollTop = mensagemRef.current.scrollHeight;
    }
  }, [isOpen, blocoDeMensagens, carregamentoMsgs]);

  return (
    <>
      <Tooltip
        hasArrow
        placement="top"
        label={
          instanceOnline
            ? "Abrir Mensagem"
            : "Tente Conectar o WhatsApp Desktop"
        }
      >
        <Button
          w={"100%"}
          colorScheme={instanceOnline ? "green" : "red"}
          alignItems={"center"}
          justifyContent={"space-between"}
          gap={2}
          onClick={() => {
            carregarMenagens();
          }}
          ref={btnRef}
        >
          {instanceOnline ? (
            <Text>Abrir WhatsApp</Text>
          ) : (
            <Text>Whatsapp Offline</Text>
          )}
          <SiWhatsapp size={22} />
        </Button>
      </Tooltip>

      <Drawer
        size={"xl"}
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent
          bgImage={`url(${back})`}
          bgSize="cover"
          bgPosition="center"
        >
          <Flex
            zIndex={99}
            borderRadius={"0 0 10px 10px"}
            alignItems={"center"}
            justifyContent={"space-between"}
            pos={"fixed"}
            top={0}
            left={0}
            bg={"white"}
            w={"100%"}
            p={2}
          >
            <Flex
              w={"100%"}
              alignItems={"center"}
              justifyContent={"flex-start"}
            >
              <Image mb={-2} alt="imagem do usuario" src={user} w={50} />
              <Text fontWeight={"semibold"} fontSize={22}>
                {nome}
              </Text>
            </Flex>
          </Flex>

          <DrawerBody py={20} w={"100%"} pos={"relative"} ref={mensagemRef}>
            {carregamentoMsgs ? (
              <Flex alignItems={"center"} justifyContent={"center"} mt={"35%"}>
                <Spinner size={"xl"} color="white" />
              </Flex>
            ) : (
              blocoDeMensagens.map((dataMsg: any) => (
                <MensagensWhatsappComponent
                  key={dataMsg.id}
                  dataMsg={dataMsg}
                />
              ))
            )}

            <InputWhatsappConponent
              telefone={telefone}
              idLead={idLead}
              enviarMensagem={enviarMensagem}
              isLoading={isLoading}
              mensagemOut={mensagemOut}
              setMensagemOut={setMensagemOut}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
