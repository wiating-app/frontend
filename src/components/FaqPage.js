import React from 'react'
import Modal from './Modal'
import Accordion, { AccordionItem } from './Accordion'
import useConfig from '../utils/useConfig'

const FaqPage = () => {
  const { faq } = useConfig()
  return (
    <Modal>
      <h2>Pytania i odpowiedzi</h2>
      <Accordion>
        {faq.map((item, index) =>
          <AccordionItem title={item.q} key={index}>
            {item.a}
          </AccordionItem>
        )}
      </Accordion>
    </Modal>
  )
}

export default FaqPage
