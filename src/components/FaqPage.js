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
      a: 'Źródłem danych zamieszczonych na mapie są posty umieszczone przez członków grupy "Wiating czyli chatki w górach" oraz wpisy naniesione bezpośrednio w platformie. Komunikacja między użytkownikami, zamieszczanie nowych punktów, aktualizacja istniejących, wymiana informacji, odbywa się na wyżej wymienionej grupie facebookowej lub też bezpośrednio na mapie.',
    },
    {
      q: 'Czy mogę założyc konto w platformie Wiating?',
      a: 'Witryna wiating.eu nie przewiduje tworzenia profili użytkowników, logowanie do serwisu odbywa się za pomocą usług uwierzytelniania Google lub Facebook i ma na celu wyłącznie zapewnienie bezpieczeństwa i funkcjonalności strony.',
    },
    {
      q: 'Co może zwykły odwiedzający - niezalogowany użytkownik?',
      a: 'Odwiedzenie aplikacji jako niezalogowany użytkownik daje nieograniczony wgląd do wszystkich zamieszczonych lokacji, poprzez przeglądanie mapy, używanie wyszukiwarki, lub otwieranie bezpośrednich linków do miejsc z zewnętrznych źródeł. Dodatkowo odwiedzający mają możliwość wyeksportowania aktualnie wyświetlanych na ekranie punktów do pliku KML.',
    },
    {
      q: 'Co daje zalogowanie się?',
      a: 'Po zalogowaniu się do platformy swoim kontem Google lub Facebook, korzystając z menu w prawym górnym rogu ekranu, użytkownik zyskuje możliwość współtworzenia treści serwisu - to znaczy dodawania nowych lokacji, edycji opisów już istniejących, oraz zamieszczania ich zdjęć. Aby tego dokonać, należy skorzystać z dedykowanych przycisków w sekcji szczegółów lokacji, które pojawiają się tylko dla zalogowanych użytkowników. Wprowadzone zmiany są widoczne natychmiast dla wszystkich użytkowników. Nie oznacza to jednak, że nie ma żadnej kontroli nad zamieszczanymi treściami. Każda zmiana, w przypadku stwierdzenia naruszeń regulaminu, może zostać wycofana przez moderatorów, którzy to mają stały wgląd do dziennika wszystkich operacji wykonanych w platformie. Zalogowany użytkownik nie może usuwać lokacji, ani dodanych zdjęć. W tym celu należy skontaktować się z administratorem, najlepiej korzystając z możliwości komunikacji, jaką daję grupa na Facebooku.',
    },
    {
      q: 'Kim są moderatorzy, oraz jakie mają możliwości?',
      a: 'Moderator, to specjalna rola użytkownika o rozszerzonych uprawnieniach, której zadaniem jest nadzór treści zamieszczanych w platformie Wiating. Aby zostać moderatorem, należy zalogować się w platformie swoim kontem Google lub Facebook tak samo jak w przypadku regularnych użytkowników, a następnie zgłosić ten fakt administratorowi (Dariusz Hajduk). Po pomyślnej weryfikacji wskazanemu kontu zostaną nadane specjalne uprawnienia. Moderatorzy zyskują wgląd do dziennika wszystkich zmian dokonanych w platformie. Z poziomu specjalnego panelu mogą cofać każdą akcję dokonaną na punktach przez jakiegokolwiek użytkownika, przywracając je do poprzedniego stanu. Poprzez akcję rozumie się tutaj edycję lokacji, stworzenie lokacji, bądź dodanie jej zdjęć. W razie konieczności moderatorzy mogą również permanentnie zablokować konto autora danej zmiany.',
    },
    {
      q: 'W jaki sposób mogę korzystać z danych Wiatingu w świetle prawa?',
      a: 'Użytkownik uprawniony jest do korzystania z danych, zdjęć, wizerunków, materiałów, tekstów lub wypowiedzi umieszczonych na grupie facebookowej „Wiating, czyli chatki w górach” oraz portalu internetowym wiating.eu, wyłącznie w zakresie własnego użytku osobistego. Wykorzystywanie powyższych danych w sposób inny dopuszczalne jest wyłącznie za wyraźną zgodą osób uprawnionych lub na podstawie odrębnych przepisów prawa.',
    },
    {
      q: 'Kto ponosi odpowiedzialność za korzystanie z informacji udostępnionych na mapie?',
      a: 'Każdy użytkownik korzysta z informacji udostępnionych poprzez aplikację na własną odpowiedzialność  i tym samym odpowiada za wszelkie ew. szkody  powstałe w rezultacie niewłaściwego użytkowania miejsc w niej wskazanych. Należy  pamiętać, że wiele z nich stanowi własność prywatną, znajduje się na obszarach chronionych i/lub leśnych, przez co biwakowanie w tych miejscach może okazać się nielegalne i wiązać się z negatywnymi konsekwencjami dla użytkownika.',
    },
    {
      q: 'Dlaczego aplikacja używa mojej lokalizacji?',
      a: 'Wiating pyta o lokalizację w celu umiejscowienia na mapie kropki Twojego położenia. Nie wysyłamy nigdzie tej informacji.',
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
