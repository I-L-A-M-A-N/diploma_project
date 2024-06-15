const options = {
	background: {
		color: '#030f11',
	},
	interactivity: {
		events: {
			onClick: {
				enable: true,
				mode: 'push',
			},
			onHover: {
				enable: true,
				mode: 'repulse',
			},
		},
		modes: {
			push: {
				quantity: 6,
			},
			repulse: {
				distance: 100,
			},
		},
	},
	particles: {
		links: {
			enable: true,
			opacity: 0.3,
			distance: 200,
			color: '#3ad4a7',
		},
		move: {
			enable: true,
			speed: { min: 1, max: 3 },
		},
		opacity: {
			value: { min: 0.3, max: 0.7 },
		},
		color: {
			value: '#32bde8',
		},
		size: {
			value: { min: 1, max: 3 },
		},
	},
}

tsParticles.load('tsparticles', options)
