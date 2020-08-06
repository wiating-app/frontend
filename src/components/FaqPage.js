import React from 'react'
import Modal from './Modal'
import Accordion, { AccordionItem } from './Accordion'

const FaqPage = () => {
  const questions = [
    {
      q: 'Czym jest wiating.eu?',
      a: 'Aplikacja wiating.eu jest platformą o charakterze społecznościowym, koleżeńskim, niekomercyjnym. Głównym celem grupy jest tworzenie zbioru miejsc zapewniających bezpieczne poruszanie się w terenie podczas wyjazdów outdoorowych, miejsc służących do przeczekania niekorzystnych warunków atmosferycznych, awaryjnych schronień oraz ciekawych turystycznie punktów biwakowo-odpoczynkowych.',
    },
    {
      q: 'Jakie jest źródło danych Wiatingu?',
      a: 'Źródłem danych zamieszczonych na mapie są posty umieszczone przez członków grupy "Wiating czyli chatki w górach" oraz wpisy naniesione bezpośrednio w platformie. Komunikacja między użytkownikami, zamieszczanie nowych punktów, aktualizacja istniejących, wymiana informacji, odbywa się na wyżej wymienionej grupie facebookowej lub też bezpośrednio na mapie',
    },
    {
      q: 'Czy mogę załoyc konto w platformie Wiating?',
      a: 'Witryna wiating.eu nie przewiduje tworzenia profili użytkowników, logowanie do serwisu odbywa się za pomocą usług uwierzytelniania Google lub Facebook i ma na celu wyłącznie zapewnienie bezpieczeństwa i funkcjonalności strony.',
    },
    {
      q: 'W jaki sposób mogę korzystać z danych Wiatingu?',
      a: 'Użytkownik uprawniony jest do korzystania z danych, zdjęć, wizerunków, materiałów, tekstów lub wypowiedzi umieszczonych na grupie facebookowej „Wiating, czyli chatki w górach” oraz portalu internetowym wiating.eu, wyłącznie w zakresie własnego użytku osobistego. Wykorzystywanie powyższych danych w sposób inny dopuszczalne jest wyłącznie za wyraźną zgodą osób uprawnionych lub na podstawie odrębnych przepisów prawa.',
    },
    {
      q: 'Kto ponosi odpowiedzialność za korzystanie z informacji udostępnionych na mapie?',
      a: 'Wszelkie ewentualne szkody powstałe na skutek korzystania z informacji udostępnionych w grupie oraz na mapie przez ich użytkowników oraz osoby trzecie zainspirowane ich treścią, przede wszystkim należy mieć na uwadze, że część z zaznaczonych miejsc jest własnością prywatną, znajduje się na obszarach chronionych lub leśnych, w związku z czym biwakowanie w tych miejscach jest nielegalne.',
    },
  ]
  return (
    <Modal>
      <h2>Pytania i odpowiedzi</h2>
      <Accordion>
        {questions.map((item, index) =>
          <AccordionItem title={item.q} key={index}>
            {item.a}
          </AccordionItem>
        )}
      </Accordion>
    </Modal>
  )
}

export default FaqPage
