import React from 'react'
import history from '../history'
import useConfig from '../utils/useConfig'
import Button from './Button'
import Modal from './Modal'
import Version from './Version'

const Info = () => {
  const { branding } = useConfig()

  const handleClose = () => {
    localStorage.setItem('seenInitialInfo', 'true')
    history.push('/')
  }

  return (
    <Modal onClose={handleClose} short id="cy-info">
      <div className="flex flex-col items-center justify-center">
        <img
          src={`${process.env.CUSTOMIZATION_URL}/logo.png`}
          srcSet={`${process.env.CUSTOMIZATION_URL}/logo@2x.png 2x`}
          className="mx-auto mb-4 block max-w-full"
          alt=""
        />
        <Version dark className="mx-auto mb-2" />
        <div
          className="prose prose-sm mb-4 max-w-none text-center"
          dangerouslySetInnerHTML={{ __html: branding.info }}
        />
        <Button variant="primary" onClick={handleClose} size="large" className="mb-2">
          Przejdź do mapy
        </Button>
        <Button
          variant="bare"
          href="https://patronite.pl/Wiating.eu"
          size="large"
          className="mb-6"
          target="_blank"
          rel="noopener noreferrer"
        >
          Wesprzyj nas
        </Button>
      </div>

      <div className="prose prose-sm flex max-w-none flex-col justify-between rounded-sm bg-gray-100 px-3 py-2 text-gray-500 sm:flex-row">
        <div className="mb-2 text-center leading-snug sm:mb-0 sm:text-left">
          Twórcy aplikacji:
          <div>
            <a href="https://github.com/firflant" target="_blank" rel="noopener noreferrer">
              Michał Kokociński
            </a>
            ,{' '}
            <a href="https://github.com/merito" target="_blank" rel="noopener noreferrer">
              Dawid Wolski
            </a>
          </div>
        </div>
        <div className="text-center leading-snug sm:text-right">
          {branding.adminInfo && (
            <div className="mb-2">
              Administracja: <div dangerouslySetInnerHTML={{ __html: branding.adminInfo }} />
            </div>
          )}
          {branding.legalInfo && (
            <div className="[&_img]:-my-[5px] [&_img]:ml-[5px] [&_img]:inline-block [&_img]:h-[30px] [&_img]:align-middle">
              Opiekun prawny: <div dangerouslySetInnerHTML={{ __html: branding.legalInfo }} />
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default Info
