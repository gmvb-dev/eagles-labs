import {
  ClassAttributes,
  HTMLAttributes,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
  useRef,
} from "react";
import { Badge, Button, Text, Tooltip, useDisclosure } from "@chakra-ui/react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import Select from "react-select";
import { PiFlowArrowDuotone } from "react-icons/pi";
import { useGetStatusLeads } from "../hooks/useGetStatusLeads";
import { JSX } from "react/jsx-runtime";

export default function DialogStatusComponent({ detalhesLeads }: any) {
  const { data: statusLeads } = useGetStatusLeads();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  const customOption = (props: {
    innerProps: JSX.IntrinsicAttributes &
      ClassAttributes<HTMLDivElement> &
      HTMLAttributes<HTMLDivElement>;
    data: {
      label:
        | string
        | number
        | boolean
        | ReactElement<any, string | JSXElementConstructor<any>>
        | Iterable<ReactNode>
        | ReactPortal
        | null
        | undefined;
      isCurrentStatus: any;
    };
  }) => {
    return (
      <div
        style={{
          paddingInline: "10px",
          borderBottom: "1px solid gray",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        {...props.innerProps}
        className="custom-option"
      >
        <Text>{props.data.label}</Text>
        <Badge mt={-1} colorScheme="red" ml={2}>
          {props.data.isCurrentStatus ? "Status atual" : ""}
        </Badge>
      </div>
    );
  };

  const options = statusLeads?.map((data: { id_status: any; status: any }) => ({
    value: data.id_status,
    label: data.status,
    isCurrentStatus: detalhesLeads?.status === data.status,
  }));

  return (
    <>
      <Tooltip hasArrow placement="left" label="Alterar etapa do lead">
        <Button
          onClick={onOpen}
          colorScheme="blue"
          w={"100%"}
          display={detalhesLeads?.status !== "Finalizado" ? "flex" : "none"}
          alignItems={"center"}
          justifyContent={"space-between"}
          gap={2}
        >
          <Text>Alterar Status</Text>
          <PiFlowArrowDuotone size={22} />
        </Button>
      </Tooltip>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Alteração de status
            </AlertDialogHeader>

            <AlertDialogBody fontWeight={"semibold"} fontSize={18}>
              <Text ml={0.5}>Você realmente deseja mudar o status?</Text>
              <Select
                placeholder="Selecione um status..."
                options={options}
                components={{ Option: customOption }}
              />
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button colorScheme="red" ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="green" onClick={onClose} ml={3}>
                Sim, alterar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
