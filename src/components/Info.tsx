import React from 'react'
import Modal from './Modal'
import Button from './Button'
import Version from './Version'
import history from '../history'
import useConfig from '../utils/useConfig'

const Info = () => {
  const { branding } = useConfig()

  const handleClose = () => {
    localStorage.setItem('seenInitialInfo', 'true')
    history.push('/')
  }

  return (
    <Modal onClose={handleClose} short id='cy-info'>
      <div className="flex flex-col items-center justify-center">
        <img
          src={`${process.env.CUSTOMIZATION_URL}/logo.png`}
          srcSet={`${process.env.CUSTOMIZATION_URL}/logo@2x.png 2x`}
          className="max-w-full mx-auto mb-4 block"
          alt=''
        />
        <Version dark className="mx-auto mb-2" />
        <div
          className="prose prose-sm max-w-none mb-4 text-center"
          dangerouslySetInnerHTML={{ __html: branding.info }}
        />
        <Button
          variant='primary'
          onClick={handleClose}
          size='large'
          className="mb-2"
        >Przejdź do mapy</Button>
        <Button
          variant='bare'
          href='https://patronite.pl/Wiating.eu'
          size='large'
          className="mb-6"
          target='_blank'
          rel='noopener noreferrer'
        >Wesprzyj nas</Button>
      </div>

      <div className="flex flex-col sm:flex-row py-2 px-3 bg-gray-100 rounded-sm justify-between text-gray-500 prose prose-sm max-w-none">
        <div className="text-center sm:text-left leading-snug mb-2 sm:mb-0">
          Twórcy aplikacji:
          <div>
            <a href='https://github.com/firflant' target='_blank' rel='noopener noreferrer' >Michał Kokociński</a>, <a href='https://github.com/merito' target='_blank' rel='noopener noreferrer' >Dawid Wolski</a>
          </div>
        </div>
        <div className="text-center sm:text-right leading-snug">
          {branding.adminInfo && (
            <div className="mb-2">
              Administracja: <div dangerouslySetInnerHTML={{ __html: branding.adminInfo }} />
            </div>
          )}
          {branding.legalInfo && (
            <div className="[&_img]:h-[30px] [&_img]:inline-block [&_img]:align-middle [&_img]:-my-[5px] [&_img]:ml-[5px]">
              Opiekun prawny: <div dangerouslySetInnerHTML={{ __html: branding.legalInfo }} />
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default Info
