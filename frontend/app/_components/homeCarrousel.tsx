"use client";
import { Carousel, CarouselContent } from "@/components/ui/carousel";
import * as React from "react"
import Autoplay from "embla-carousel-autoplay";
import HomeItem from "./homeItem";



function HomeCarrousel() {
    const plugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true })
    );


    return (
        <Carousel plugins={[plugin.current]} opts={{
            align: "start",
            loop: true,
        }} className="flex flex-col items-center justify-center">
            <CarouselContent >
                <HomeItem image_url={"/beach_volley_home.svg"} image_alt={"Imagem vôlei de praia"} text={"Encontre campeonatos de sua modalidade preferida perto de você!"} />
                <HomeItem image_url={"/schedule_home.svg"} image_alt={"Imagem calendário"} text={"Organize campeonatos e gerencie as partidas em um único lugar!"} />
                <HomeItem image_url={"/basketball_home.svg"} image_alt={"Imagem basquete"} text={"Monte sua equipe e seja um campeão!"} />
            </CarouselContent>
        </Carousel>
    );
}

export default HomeCarrousel;