# verkefni 6, vefforritun 2 2022

## live útgáfa
hægt er að finna live útgáfu af síðunni hýsta hjá vercel [hér](https://vef2-v6.vercel.app)

## keyrsla
```bash
npm run dev
# eða
yarn dev
```

## stack
notaði [prismic](https://prismic.io) og [graphql](https://graphql.org) apann þeirra til að útbúa headless CMS. bakendinn notast við [next.js](https://nextjs.org) og framendinn er skrifaður í [react](https://reactjs.org). síðan er svo hýst hjá [vercel](https://vercel.com)

## ferli og hugsanleg framtíð
notaði legacy builder hjá prismic til að smíða 'slices'. ef ég byrjaði nýja síðu núna með prismic myndi ég nota nýja slice-builderinn hann lookar cozy. ég hélt ég myndi ekkert nota slices en núna notast síðan eiginlega eingöngu við þær.

ef ég held áfram með síðuna langar mig að finna út hvernig hægt sé að tengja queries beint í .gql skjöl til að auðvelda skipulag og gera allt bara aðeins fínna. eins og er eru queries bara mjög langir strengir sem bæði taka of mikið pláss og eru forljótir.