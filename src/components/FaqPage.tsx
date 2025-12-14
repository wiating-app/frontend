import React from 'react'
import useConfig from '../utils/useConfig'
import Accordion, { AccordionItem } from './Accordion'
import Heading from './Heading'
import Modal from './Modal'

const FaqPage = () => {
  const { faq } = useConfig()
  return (
    <Modal>
      <Heading level={5} gutterBottom>
        Pytania i odpowiedzi
      </Heading>
      <Accordion>
        {faq?.map((item: any, index: number) => (
          <AccordionItem title={item.q} key={index}>
            {item.a}
          </AccordionItem>
        ))}
      </Accordion>
    </Modal>
  )
}

export default FaqPage
