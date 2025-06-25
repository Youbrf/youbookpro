import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import BookingBlock from './components/BookingBlock';
import './editor.scss';

export default function Edit() {
	const blockProps = useBlockProps();

	return (
		<div {...blockProps}>
			<BookingBlock />
		</div>
	);
}
