import React from 'react'
import { Link } from 'react-router-dom'
import Modal from './Modal'

const Cookies = () =>
  <Modal>
    <h2>Cookies</h2>
    <p>Na naszej stronie używamy różnych technologii do zbierania i przetwarzania danych osobowych oraz analizowania ruchu na stronie i w Internecie. Do tego celu możemy zbierać Twoje IP lub inne dane osobowe, które nam podasz.</p>
    <p>Administratorem danych osobowych jest ..., adres e-mail: .....</p>
    <p>Przetwarzanie danych jest uzasadnione z uwagi na nasze usprawiedliwione potrzeby, co obejmuje między innymi konieczność zapewnienia bezpieczeństwa usługi, dokonanie pomiarów statystycznych, ulepszania naszych usług i dopasowania ich do potrzeb i wygody użytkowników (np. personalizowanie treści w usługach) jak również prowadzenie marketingu i promocji własnych usług Administratora. Dane te są przetwarzane do czasu istnienia uzasadnionego interesu lub do czasu złożenia przez Ciebie sprzeciwu wobec przetwarzania. Dane osobowe będą przekazywane wyłącznie naszym podwykonawcom, tj. dostawcom usług informatycznych.</p>
    <p>Przysługuje Ci prawo żądania dostępu do treści danych osobowych, ich sprostowania, usunięcia oraz prawo do ograniczenia ich przetwarzania. Ponadto także prawo do cofnięcia zgody w dowolnym momencie bez wpływu na zgodność z prawem przetwarzania, prawo do przenoszenia danych oraz prawo do wniesienia sprzeciwu wobec przetwarzania danych osobowych. Posiadasz prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych.</p>
    <p>Serwis wykorzystuje pliki cookies. Korzystając ze strony wyrażasz zgodę na wykorzystywanie plików cookies.</p>
    <p>Więcej informacji w <Link to='/polityka-prywatnosci'>polityce prywatności</Link>.
    </p>
  </Modal>

export default Cookies
