import React from 'react'
import Modal from './Modal'
import Accordion, { AccordionItem } from './Accordion'

const FaqPage = () => {
  const questions = [
    {
      q: 'Pytanie 1',
      a: 'Odpowiedź',
    },
    {
      q: 'Pytanie 2',
      a: 'Odpowiedź',
    },
    {
      q: 'Pytanie 3',
      a: 'Odpowiedź',
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
