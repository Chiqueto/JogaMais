"use client";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import * as React from "react"
import Autoplay from "embla-carousel-autoplay";
import HomeItem from "./homeItem";
import Image from "next/image";



function HomeCarrousel() {
    const plugin = React.useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true })
    );


    return (
        <Carousel plugins={[plugin.current]} className="flex flex-col items-center justify-center">
            <CarouselContent>
                <HomeItem image_url={"/beach_volley_home.svg"} image_alt={"Imagem vôlei de praia"} text={"Encontre campeonatos de sua modalidade preferida perto de você!"} />
                < CarouselItem className="flex flex-col items-center justify-center"><p className="text-2xl text-center">Encontre campeonatos de sua modalidade preferida perto de você!</p><Image src="/beach_volley_home.svg" alt="Imagem vôlei de praia" width={320} height={320} /></CarouselItem>
                <CarouselItem>...</CarouselItem>
                <CarouselItem>...</CarouselItem>
            </CarouselContent>
        </Carousel>
    );
}

export default HomeCarrousel;