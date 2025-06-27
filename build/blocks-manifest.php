<?php
// This file is generated. Do not modify it manually.
return array(
	'booking' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'youbookpro/booking',
		'version' => '0.1.0',
		'title' => 'Booking',
		'category' => 'widgets',
		'icon' => 'calendar-alt',
		'description' => 'Bloc de réservation de services via YouBookPro',
		'example' => array(
			
		),
		'attributes' => array(
			'buttonColor' => array(
				'type' => 'string',
				'default' => 'black'
			),
			'buttonTextColor' => array(
				'type' => 'string',
				'default' => 'white'
			),
			'buttonHoverColor' => array(
				'type' => 'string',
				'default' => '#333333'
			),
			'buttonHoverTextColor' => array(
				'type' => 'string',
				'default' => 'white'
			)
		),
		'supports' => array(
			'color' => array(
				'text' => true,
				'background' => true
			),
			'typography' => array(
				'fontSize' => true,
				'lineHeight' => true
			),
			'spacing' => array(
				'padding' => true,
				'margin' => true
			)
		),
		'textdomain' => 'booking',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	),
	'payment' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'create-block/payment',
		'version' => '0.1.0',
		'title' => 'Payment',
		'category' => 'widgets',
		'icon' => 'smiley',
		'description' => 'Example block scaffolded with Create Block tool.',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'textdomain' => 'payment',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js',
		'usesContext' => array(
			'youbookpro/serviceId'
		)
	)
);
