import { Card, CardBody, CardHeader, Heading, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function CustomCard({ children }: { children: ReactNode }) {
    return (
        <Card className="flex justify-center shadow-lg w-[600px]">
            <CardHeader className="text-center">
                <Heading size="md">Guess A Number</Heading>
            </CardHeader>
            <CardBody className="flex flex-col items-center space-y-4 justify-center">
                {children}
            </CardBody>
        </Card>
    );
}
