import React from 'react'
import Modal from './Modal'
import Heading from './Heading'
import Accordion, { AccordionItem } from './Accordion'
import useConfig from '../utils/useConfig'

const FaqPage = () => {
  const { faq } = useConfig()
  return (
    <Modal>
      <Heading level={5} gutterBottom>Pytania i odpowiedzi</Heading>
      <Accordion>
        {faq?.map((item: any, index: number) =>
          <AccordionItem title={item.q} key={index}>
            {item.a}
          </AccordionItem>
        )}
      </Accordion>
    </Modal>
  )
}

export default FaqPage
