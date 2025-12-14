import React from 'react'
import history from '../history'
import Button from './Button'
import Modal from './Modal'

const AcceptDataPrivacy = () => {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    if (!localStorage.getItem('acceptDataPrivacy')) {
      setIsVisible(true)
    }
  }, [])

  const acceptDataPrivacy = () => {
    setIsVisible(false)
    localStorage.setItem('acceptDataPrivacy', 'true')
  }

  return isVisible ? (
    <Modal onClose={acceptDataPrivacy} short id="cy-privacy">
      <div className="prose prose-sm max-w-none">
        <h2>Informacja o prywatności</h2>
        <p>
          Na naszej stronie używamy różnych technologii do zbierania i przetwarzania danych osobowych w celu
          personalizowania treści i reklam oraz analizowania ruchu na stronie i w Internecie. Do tego celu możemy
          zbierać Twoje IP lub inne dane osobowe, które nam podasz.
        </p>
        <p>
          Administratorem danych osobowych jest <em>Administracja Grupy Wiating - Dariusz Hajduk</em>, adres e-mail:
          wiating@wiating.eu
        </p>
        <p>
          Przetwarzanie danych jest uzasadnione z uwagi na nasze usprawiedliwione potrzeby, co obejmuje między innymi
          konieczność zapewnienia bezpieczeństwa usługi, dokonanie pomiarów statystycznych, ulepszania naszych usług i
          dopasowania ich do potrzeb i wygody użytkowników jak również prowadzenie marketingu i promocji własnych usług
          Administratora. Dane te są przetwarzane do czasu istnienia uzasadnionego interesu lub do czasu złożenia przez
          Ciebie sprzeciwu wobec przetwarzania. Dane osobowe będą przekazywane wyłącznie naszym podwykonawcom, tj.
          dostawcom usług informatycznych.
        </p>
        <p>
          Przysługuje Ci prawo żądania dostępu do treści danych osobowych, ich sprostowania, usunięcia oraz prawo do
          ograniczenia ich przetwarzania. Ponadto także prawo do cofnięcia zgody w dowolnym momencie bez wpływu na
          zgodność z prawem przetwarzania, prawo do przenoszenia danych oraz prawo do wniesienia sprzeciwu wobec
          przetwarzania danych osobowych. Posiadasz prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych.
        </p>
        <p>
          Serwis wykorzystuje pliki cookies. Korzystając ze strony wyrażasz zgodę na wykorzystywanie plików cookies.
        </p>
        <p>
          Więcej informacji w{' '}
          <span
            className="cursor-pointer underline"
            onClick={() => {
              acceptDataPrivacy()
              history.push('/privacy-policy')
            }}
          >
            polityce prywatności
          </span>
          .
        </p>
      </div>

      <div className="mt-4 flex items-center justify-end">
        <Button size="large" variant="primary" onClick={acceptDataPrivacy}>
          Zgadzam się
        </Button>
      </div>
    </Modal>
  ) : null
}

export default AcceptDataPrivacy
