export default {
  pl: {
    yes: 'Tak',
    no: 'Nie',
    available: 'Jest',
    unavailable: 'Brak',
    noData: 'Nie podano',
    save: 'Zapisz',
    cancel: 'Anuluj',
    loading: 'Ładowanie',
    search: 'Przeszukaj Wiating',
    backToResults: 'Powrót do wyników',
    locationInfo: {
      description: 'Opis',
      directions: 'Usytuowanie i wskazówki dojścia',
      fire: {
        label: 'Dostęp do ognia',
        true: 'Jest możliwość rozpalenia ognia',
        false: 'Brak dostępu do ognia',
      },
      water: {
        label: 'Dostęp do wody',
        true: 'Istnieje dostęp do wody',
        false: 'Brak dostępu do wody',
      },
      lastUpdate: 'Ostatnia aktualizacja',
      isDisabled: 'Niedostępna / zniszczona',
      setAsDisabled: 'Oznacz jako niedostępną lub zniszczoną',
      unpublish: 'Wstrzymaj publikację',
    },
    locationType: {
      cabin: 'Chatka',
      cabinFireplace: 'Chatka z paleniskiem',
      cabinHosted: 'Chatka z opiekunem',
      shed: 'Wiata',
      waterSource: 'Źródło',
      cave: 'Jaskinia',
      tower: 'Wieża widokowa',
      tentCamp: 'Baza namiotowa',
      urbex: 'Urbex',
      sacral: 'Miejsce sakralne',
      waterFront: 'Stanica wodna',
      emergency: 'Schronienie awaryjne',
    },
    noResults: 'Nic nie znaleziono',
    connectionProblem: {
      map: 'Nie można nawiązać połączenia z bazą lokacji.',
      location: 'Problem z połączeniem, lub dana lokacja nie istnieje.',
      logs: 'Nie udało się połączyć z bazą logów :(',
    },
    markerForm: {
      heading: {
        addMarker: 'Dodaj nową lokację',
        editMarker: 'Edytuj lokację',
      },
      location: 'Położenie geograficzne',
      locationHint: 'Postaraj się jak najdokładniej umieścić pinezkę lokacji na mapie. Podczas dodawania nowej lokacji możesz przesuwać pinezkę, aby wyznaczyć lokalizację jak najdokładniej. Możesz też wpisać współrzędne w odpowiednie pole, wtedy pinezka przeniesie się w podane miejsce.',
      place: 'Nazwa lokacji',
      placeHint: 'Postaraj się aby nazwa lokacji była krótka i unikatowa, związana z konkretnym miejscem które dodajesz, tak aby potem można je było łatwo znaleźć. Jeśli lokacja nie ma nazwy własnej (np. Schron Czumak) to warto nawiązać do charakterystycznych punktów znajdujących się w pobliżu. Staraj się unikać ogólnych nazw, takich jak „Wiata przy jeziorze”. Zamiast tego możesz napisać „Wiata przy jeziorze Bukowskim” albo „Chatka przy zielonym szlaku na Turbacz” co ułatwi przeglądanie i wyszukiwanie.',
      type: 'Typ lokacji',
      typeHint: 'Wybierz odpowiedni typ miejsca. Dzięki temu na mapie pokaże się odpowiednia ikona i osoby zainteresowane, na przykład tylko wieżami widokowymi, będą mogły łatwo znaleźć to miejsce.',
      description: 'Opis lokacji',
      descriptionHint: 'Podaj przydatne dla odwiedzających informacje, takie jak wielkość, liczbę miejsc, dostępność, ochrona przed deszczem, jakie są zasady korzystania, dane właściciela i inne adekwatne do dodawanej lokacji. W opisie nie podawaj: współrzędnych lokacji (jest na nie osobne pole), wskazówek dojścia na miejsce (również jest na to osobne pole), informacji o dostępności wody i ognia (są na to osobne pola na końcu formularza).',
      directionsHint: 'Wpisz szczegóły gdzie leży dane miejsce i jak do niego dotrzeć, np. "chatkowym szlakiem od odejścia zielonego", "w kępie krzaków na łące", "mostkiem od północy" itp. Pomyśl, że jesteś już blisko, ale jest środek nocy i nic nie widać i ta informacja ma Cię doprowadzić do celu.',
      waterDescription: 'Opis dostępu do wody (opcjonalnie)',
      waterDescriptionHint: 'Podaj szczegóły, np. jak wydajny jest strumień.',
      fireDescription: 'Opis dostępu do ognia (opcjonalnie)',
      fireDescriptionHint: 'Podaj szczegóły, np. skąd wziąć drewno.',
    },
    notifications: {
      markerUpdated: 'Lokacja zaktualizowana.',
      newMarkerAdded: 'Dodano nową lokację.',
      couldNotSaveMarker: 'Nie udało się zapisać markera.',
      photoAdded: 'Zdjęcia dodane pomyślnie.',
      couldNotSavePhoto: 'Nie udało się zapisać zdjęcia.',
      wrongCoordsFormat: 'Niepoprawny format współrzędnych.',
      couldNotRestoreSession: 'Nie udało się uwierzytelnić. Spróbuj się wylogować i zalogować ponownie.',
      locationDeleted: 'Lokacja została usunięta.',
      couldNotDeleteLocation: 'Nie udało się usunąć lokacji.',
      pointOnMap: 'Wskaż dowolne miejsce na mapie.',
      urlCopied: 'Skopiowano adres URL lokacji do schowka.',
      couldNotReport: 'Nie udało się przesłać zgłoszenia.',
      coordinatesCopied: 'Skopiowano koordynaty do schowka.',
    },
    formLabels: {
      formInvalid: 'Formularz jest niepoprawnie uzupełniony. Sprawdź pola.',
      requiredField: 'To pole jest obowiązkowe.',
      minChars: 'Wartość tego pola powinna mieć conajmniej :length: znaków.',
    },
    actions: {
      edit: 'Edytuj',
      report: 'Zgłoś',
      addPhoto: 'Dodaj zdjęcia',
    },
    reportReasons: {
      duplicate: 'Duplikat innego miejsca',
      doesNotExist: 'Lokacja nie istnieje',
      photoRemoval: 'Nieodpowiednie zdjęcie',
      other: 'Inny',
    },
    reportDescriptions: {
      duplicate: 'Wklej tutaj link do lokacji, której ta stanowi duplikat',
      doesNotExist: 'Podaj szczegóły',
      photoRemoval: 'Opisz, które zdjęcie(a) należy usunąć',
      other: 'Opisz problem',
    },
    addMarker: 'Dodaj lokację',
    addMarkerHere: 'Dodaj tu lokację',
    auth: {
      loginSuccessful: 'Zalogowano pomyślnie',
      login: 'Logowanie',
      logout: 'Wyloguj',
    },
    language: 'Język',
    selectLanguage: 'Wybierz nowy język',
    languageChanged: 'Język zmieniony.',
    administration: 'Panel moderatora',
    history: 'Moja historia',
    historyDescription: 'Lista ostatnio wprowadzonych przez ciebie zmian.',
    informations: 'Informacje',
    termsAndConditions: 'Regulamin',
    privacyPolicy: 'Polityka prywatności',
    faq: 'Pytania i odpowiedzi',
    confirmDeleteLocation: 'Na pewno bezpowrotnie usunąć tą lokację?',
    delete: 'Usuń',
    legend: 'Legenda',
    pointOnMap: 'Wskaż na mapie',
    enterCoordinates: 'Wprowadź współrzędne',
    inCurrentLocation: 'W aktualnej lokalizacji',
    share: 'Udostępnij',
    details: 'Szczegóły',
    changeLog: 'Dziennik zmian',
    reports: 'Zgłoszenia',
    itemsFound: 'Znaleziono # pozycji',
    newLocation: 'Nowa lokacja',
    you: 'Ty',
    verification: 'Weryfikacja',
    verified: 'Zweryfikowano',
    unverified: 'Niezweryfikowane',
    date: 'Data',
    locationAndFields: 'Lokacja i edytowane pola',
    authorOfChange: 'Autor zmiany',
    findById: 'Szukaj po ID lokacji',
    verificationState: 'Stan weryfikacji',
    all: 'Wszystkie',
    filter: 'Filtruj',
    reset: 'Resetuj filtry',
    detailsOfChange: 'Szczegóły zmiany',
    user: 'Użytkownik',
    show: 'Pokaż',
    newLocationCreated: 'Utworzenie nowej lokacji',
    changes: 'Zmiany',
    alreadyVerified: 'Już zweryfikowano',
    markAsVerified: 'Oznacz jako zweryfikowany',
    banAuthor: 'Zbanuj autora',
    cannotBanYourself: 'Nie możesz zbanować sam(a) siebie',
    revertThisChange: 'Cofnij tą zmianę',
    field: 'Pole',
    oldContent: 'Stara treść',
    newContent: 'Nowa treść',
    location: 'Lokacja',
    reportReason: 'Treść zgłoszeń',
    noReportsAvailable: 'Obecnie nie ma w systemie żadnych otwartych zgłoszeń.',
    reportsForLocation: 'Zgłoszenia do lokacji',
    dateOfLastEdit: 'Data ostatniej edycji lokacji',
    showLocationLogs: 'Pokaż logi lokacji',
    markAsDone: 'Oznacz zgłoszenia jako załatwione',
    export: 'Eksport',
    exportSentence: 'Przycisk poniżej wykonuje kopię zapasową całej bazy lokacji i eksportuje ją do pliku KML.',
    exportButton: 'Eksportuj bazę do KML',
    iAmWorking: 'Pracuję, cierpliwości...',
    sendNewPhotos: 'Prześlij nowe zdjęca',
    send: 'Prześlij',
    upload: 'Dodaj zdjęcia',
    unpublished: 'Nieopublikowane',
    navigate: 'Nawiguj',
    copyCoordinates: 'Skopuj koordynaty',
  },


  en: {
    yes: 'Yes',
    no: 'No',
    available: 'Is available',
    unavailable: 'Not available',
    noData: 'No data',
    save: 'Save',
    cancel: 'Cancel',
    loading: 'Loading',
    search: 'Search in Wiating',
    backToResults: 'Back to results',
    locationInfo: {
      description: 'Description',
      directions: 'How to reach the place',
      fire: {
        label: 'Access to fire',
        true: 'There is access to fire',
        false: 'Fire is impossible',
      },
      water: {
        label: 'Access to water',
        true: 'There is access to water',
        false: 'No access to water',
      },
      lastUpdate: 'Last update',
      isDisabled: 'Unavailable or destroyed',
      setAsDisabled: 'Set as unavailable/destroyed',
      unpublish: 'Set as unpublished',
    },
    locationType: {
      cabin: 'Cabin',
      cabinFireplace: 'Cabin with a fireplace',
      cabinHosted: 'Cabin with a host',
      shed: 'Shed',
      waterSource: 'Water source',
      cave: 'Cave',
      tower: 'Observation Tower',
      tentCamp: 'Tent camp',
      urbex: 'Urbex',
      sacral: 'Sacral place',
      waterFront: 'Water front',
      emergency: 'Emergency shelter',
    },
    noResults: 'No results',
    connectionProblem: {
      map: 'Could not connect to the database of locations.',
      location: 'Connection error, or given location does not exist.',
      logs: 'Could not connect to the database of locations.',
    },
    markerForm: {
      heading: {
        addMarker: 'Add new location',
        editMarker: 'Edit location',
      },
      location: 'Coordinates',
      locationHint: 'English hints.',
      place: 'Name of the place',
      placeHint: 'English hints.',
      type: 'Type of the place',
      typeHint: 'English hints.',
      description: 'Description',
      descriptionHint: 'English hints.',
      directionsHint: 'English hints.',
      waterDescription: 'Access to water description (optional)',
      waterDescriptionHint: 'English hints.',
      fireDescription: 'Access to fire description (optional)',
      fireDescriptionHint: 'English hints.',
    },
    notifications: {
      markerUpdated: 'Marker updated.',
      newMarkerAdded: 'New marker added.',
      couldNotSaveMarker: 'Could not save a marker.',
      photoAdded: 'Photos uploaded successfully.',
      couldNotSavePhoto: 'Could not save a photo.',
      wrongCoordsFormat: 'Wrong coordinations format.',
      couldNotRestoreSession: 'Could not authenticate. Try to log out and log in again.',
      locationDeleted: 'Location has been deleted.',
      couldNotDeleteLocation: 'Could not delete location.',
      pointOnMap: 'Point the location on a map.',
      urlCopied: 'URL of current location copied to clipboard.',
      couldNotReport: 'Could not send the form.',
      coordinatesCopied: 'Location coordinaties copied to clipboard.',
    },
    formLabels: {
      formInvalid: 'Form contains errors. Check all fields.',
      requiredField: 'This field is required.',
      minChars: 'This field should have at least :length: characters.',
    },
    actions: {
      edit: 'Edit',
      report: 'Report',
      addPhoto: 'Add photos',
    },
    reportReasons: {
      duplicate: 'Duplicated locaotion',
      doesNotExist: 'Location does not exist',
      photoRemoval: 'Unproperiate photo',
      other: 'Other',
    },
    reportDescriptions: {
      duplicate: 'Paste here the link to location, that this is one a duplicate of',
      doesNotExist: 'Give more details',
      photoRemoval: 'Describe, which photo(s) should be removed',
      other: 'Describe the problem',
    },
    addMarker: 'Add location',
    addMarkerHere: 'Add location here',
    auth: {
      loginSuccessful: 'Login successful',
      login: 'Login',
      logout: 'Logout',
    },
    language: 'Language',
    administration: 'Administration panel',
    history: 'My history',
    historyDescription: 'List of your recent changes.',
    selectLanguage: 'Select language',
    languageChanged: 'Language changed.',
    informations: 'Informations',
    termsAndConditions: 'Terms and conditions',
    privacyPolicy: 'Privacy policy',
    faq: 'FAQ',
    delete: 'Delete',
    confirmDeleteLocation: 'Are you sure to permanently delete this location?',
    legend: 'Legend',
    pointOnMap: 'Point on map',
    enterCoordinates: 'Enter coordinates',
    inCurrentLocation: 'In current location',
    share: 'Share',
    details: 'Details',
    changeLog: 'Change log',
    reports: 'Reports',
    itemsFound: 'Found # items',
    newLocation: 'New location',
    you: 'You',
    verification: 'Verification',
    verified: 'Verified',
    unverified: 'Unverified',
    date: 'Date',
    locationAndFields: 'Location and edited fields',
    authorOfChange: 'Author of change',
    findById: 'Find by ID',
    verificationState: 'Verification state',
    all: 'All',
    filter: 'Filter',
    reset: 'Reset filters',
    detailsOfChange: 'Details of change',
    user: 'User',
    show: 'Show',
    newLocationCreated: 'New locoation created',
    changes: 'Changes',
    alreadyVerified: 'Already verified',
    markAsVerified: 'Mark as verified',
    banAuthor: 'Ban author',
    cannotBanYourself: 'You cannot ban yourself',
    revertThisChange: 'Revert this change',
    field: 'Field',
    oldContent: 'Old content',
    newContent: 'New content',
    location: 'Location',
    reportReason: 'Report reasons',
    noReportsAvailable: 'Currently there are no open reports in the system.',
    reportsForLocation: 'Reports for location',
    dateOfLastEdit: 'Date of last edit',
    showLocationLogs: 'Show location logs',
    markAsDone: 'Mark as done',
    export: 'Export',
    exportSentence: 'The button below makes a backup of whole locations database and exports it to downloadable KML file.',
    exportButton: 'Export database to KML',
    iAmWorking: 'I am working It may take a while...',
    sendNewPhotos: 'Send new photos',
    send: 'Send',
    upload: 'Add from drive',
    unpublished: 'Unpublished',
    navigate: 'Navigate',
    copyCoordinates: 'Copy coordinates',
  },
}
