import { CarouselItem } from "@/components/ui/carousel";
import Image from 'next/image';

interface HomeItemProps {
    image_url: string;
    image_alt: string;
    text: string;
}

function homeItem({ image_url, image_alt, text }: HomeItemProps) {
    return (
        <CarouselItem className="flex flex-col justify-center items-center flex-wrap mt-8 w-full gap-6">
            <p className="text-2xl text-center max-w-[360px] ">{text}</p>
            <Image src={image_url} alt={image_alt} width={320} height={320} />
        </CarouselItem>

    );
}

export default homeItem;