import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { HTMLInputTypeAttribute } from "react";

interface InputWithLabelProps {
    labelText: string,
    placeholder: string,
    htmlfor: string,
    type: HTMLInputTypeAttribute,
    id: string
}


const InputWithLabel = ({ labelText, placeholder, htmlfor, type, id }: InputWithLabelProps) => {
    return (
        <div className="flex flex-col justify-center w-full items-start gap-1.5">
            <Label className="text-lg" htmlFor={htmlfor}>{labelText}</Label>
            <Input className="w-full text-base block" type={type} id={id} placeholder={placeholder} />
        </div>
    );
}

export default InputWithLabel;