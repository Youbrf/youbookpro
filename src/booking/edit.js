import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps, ColorPalette } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import BookingBlock from './components/BookingBlock';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
  const blockProps = useBlockProps();
  const { buttonColor, buttonTextColor, buttonHoverColor, buttonHoverTextColor } = attributes;

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Bouton', 'youbookpro')} initialOpen={true}>
          <p>{__('Couleur du bouton', 'youbookpro')}</p>
          <ColorPalette
            value={buttonColor}
            onChange={(color) => setAttributes({ buttonColor: color })}
          />

          <p>{__('Couleur du texte du bouton', 'youbookpro')}</p>
          <ColorPalette
            value={buttonTextColor}
            onChange={(color) => setAttributes({ buttonTextColor: color })}
          />

          <p>{__('Couleur du bouton au survol', 'youbookpro')}</p>
          <ColorPalette
            value={buttonHoverColor}
            onChange={(color) => setAttributes({ buttonHoverColor: color })}
          />

          <p>{__('Couleur du texte au survol', 'youbookpro')}</p>
          <ColorPalette
            value={buttonHoverTextColor}
            onChange={(color) => setAttributes({ buttonHoverTextColor: color })}
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <BookingBlock 
          buttonColor={buttonColor} 
          buttonTextColor={buttonTextColor}
          buttonHoverColor={buttonHoverColor}
          buttonHoverTextColor={buttonHoverTextColor}
        />
      </div>
    </>
  );
}
