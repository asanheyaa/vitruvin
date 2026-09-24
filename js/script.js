// burger-menu
const burgerMenu = document.querySelector('.burger-menu');
if (burgerMenu) {
	burgerMenu.addEventListener('click', (e) => {
		burgerMenu.classList.toggle('_active');
		document.querySelector('.header-menu').classList.toggle('_active');
		document.body.classList.toggle('_lock');
	});
}


const quizes = document.querySelectorAll('[data-quize]');

if (quizes.length > 0) {

	quizes.forEach(quize => {
		const triggers = document.querySelectorAll('[data-quize-trigger]');
		triggers.forEach(trigger => {
			trigger.addEventListener('click', (e) => {
				const trigerParent = trigger.closest('[data-quize-section]')
				const currentSectionId = Number(trigerParent.dataset.quizeSection)
				const activeSections = document.querySelectorAll('[data-quize-section]._active')
				const currentSections = document.querySelectorAll(`[data-quize-section='${currentSectionId + 1}']`)
				if (currentSections.length > 0) {
					if (quize.dataset.quize === 'main') {

						const currentInputs = activeSections[0].querySelectorAll('input')
						const isValid = trigger.dataset.quizeTrigger === 'no-validate' ? true : validateInputs(Array.from(currentInputs))
						if (isValid) {
							removeClassesFromActiveSection(activeSections)
							addClassesToCurrentSection(currentSections)
							scrollToTopSection(quize)
							if (trigerParent.dataset.quizeSectionNoCount === undefined) {
								const progressBar = quize.querySelector('[data-quize-progress]');

								const inactiveProgressBars = progressBar.querySelectorAll(':scope > *:not(._active)');

								if (inactiveProgressBars.length > 0) {
									inactiveProgressBars[0].classList.add('_active');
								}
							}
							if (currentSections[0].dataset.quizeSectionLoader !== undefined) {
								startCascadeLoader();

							}


						}

					} else {
						removeClassesFromActiveSection(activeSections)
						addClassesToCurrentSection(currentSections)
						scrollToTopSection(quize)
					}
				}

			})
		});

		const progressWrapper = quize.querySelector('[data-quize-progress]');
		if (progressWrapper) {
			
			addProgressItems()
			function addProgressItems() {
				const quizeSections = document.querySelectorAll('[data-quize-section]');

				quizeSections.forEach(quizeSection => {
					const isNoCountSection = quizeSection.dataset.quizeSectionNoCount
					if (isNoCountSection == undefined) {
						const progressItem = document.createElement("div")
						progressItem.classList.add('footer-form-quize__item')
						if (progressWrapper.children.length === 0) {
							progressItem.classList.add('_active')
						}
						progressWrapper.append(progressItem)
					}
				});
			}
		}

		const backButtons = document.querySelectorAll('[data-quize-back]')
		if (backButtons.length > 0){
			backButtons.forEach(backButton => {
				backButton.addEventListener('click', (e)=>{
					const parentSection = backButton.closest('[data-quize-section]')
					const sectionId = parentSection.dataset.quizeSection
					const previousSections = document.querySelectorAll(`[data-quize-section="${sectionId - 1}"]`);
				if (previousSections.length > 0){
					const activeSections = document.querySelectorAll('[data-quize-section]._active');
					removeClassesFromActiveSection(activeSections)
					addClassesToCurrentSection(previousSections)

					if (parentSection.dataset.quizeSectionNoCount === undefined) {
								const progressBar = quize.querySelector('[data-quize-progress]');

								const inactiveProgressBars = progressBar.querySelectorAll(':scope > *._active');
						console.log(inactiveProgressBars);
								if (inactiveProgressBars.length > 1) {
									inactiveProgressBars[inactiveProgressBars.length - 1].classList.remove('_active');
								}
							}
				}
				})
				
			});
		}

	
	});


}

function removeClassesFromActiveSection(activeSections) {
	activeSections.forEach(activeSection => {
		activeSection.classList.remove('_active')
		activeSection.classList.remove('_anim')
	});
}
function addClassesToCurrentSection(currentSections) {
	currentSections.forEach(currentSection => {
		currentSection.classList.add('_active')
		currentSection.classList.add('_anim')
	});
}

function scrollToTopSection(section) {
	const header = document.querySelector('.quize-header');
	section.scrollIntoView({
  behavior: 'smooth', // Анімація: 'smooth' (плавно) або 'auto' (миттєво, за замовчуванням)
  block: 'start',    // Вертикальне вирівнювання: 'start', 'center', 'end', 'nearest'
});
}

function validateInputs(inputs) {
	const textInputs = inputs.filter(i => i.type === 'text' || i.type === 'number' || i.type === 'email');
	const isTextValid = textInputs.length === 0 || textInputs.every(input => {
		if (input.type === 'email' && !input.checkValidity()) {
			input.reportValidity()
		}
		return input.value.trim() !== '' && input.checkValidity();
	});

	const choiceInputs = inputs.filter(i => i.type === 'radio' || i.type === 'checkbox');
	const isChoiceValid = choiceInputs.length === 0 || choiceInputs.some(input => {
		return input.checked;
	});

	return isTextValid && isChoiceValid;
}
function dynamicAdaptiv() {
	class DynamicAdapt {
		constructor(type) {
			this.type = type
		}

		init() {
			// массив объектов
			this.оbjects = []
			this.daClassname = '_dynamic_adapt_'
			// массив DOM-элементов
			this.nodes = [...document.querySelectorAll('[data-da]')]

			// наполнение оbjects обьектами
			this.nodes.forEach((node) => {
				const data = node.dataset.da.trim()
				const dataArray = data.split(',')
				const оbject = {}
				оbject.element = node
				оbject.parent = node.parentNode
				оbject.destination = document.querySelector(`${dataArray[0].trim()}`)
				оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : '767'
				оbject.place = dataArray[2] ? dataArray[2].trim() : 'last'
				оbject.index = this.indexInParent(оbject.parent, оbject.element)
				this.оbjects.push(оbject)
			})
			this.arraySort(this.оbjects)

			// массив уникальных медиа-запросов
			this.mediaQueries = this.оbjects
				.map(({ breakpoint }) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)
				.filter((item, index, self) => self.indexOf(item) === index)
			// навешивание слушателя на медиа-запрос
			// и вызов обработчика при первом запуске
			this.mediaQueries.forEach((media) => {
				const mediaSplit = media.split(',')
				const matchMedia = window.matchMedia(mediaSplit[0])
				const mediaBreakpoint = mediaSplit[1]

				// массив объектов с подходящим брейкпоинтом
				const оbjectsFilter = this.оbjects.filter(({ breakpoint }) => breakpoint === mediaBreakpoint)
				matchMedia.addEventListener('change', () => {

					this.mediaHandler(matchMedia, оbjectsFilter)
				})
				this.mediaHandler(matchMedia, оbjectsFilter)
			})
		}

		// Основная функция
		mediaHandler(matchMedia, оbjects) {
			if (matchMedia.matches) {
				оbjects.forEach((оbject) => {
					// оbject.index = this.indexInParent(оbject.parent, оbject.element);
					this.moveTo(оbject.place, оbject.element, оbject.destination)
				})
			} else {
				оbjects.forEach(({ parent, element, index }) => {
					if (element.classList.contains(this.daClassname)) {
						this.moveBack(parent, element, index)
					}
				})
			}
		}

		// Функция перемещения
		moveTo(place, element, destination) {
			element.classList.add(this.daClassname)
			if (place === 'last' || place >= destination.children.length) {
				destination.append(element)
				return
			}
			if (place === 'first') {
				destination.prepend(element)
				return
			}
			destination.children[place].before(element)
		}

		// Функция возврата
		moveBack(parent, element, index) {
			element.classList.remove(this.daClassname)
			if (parent.children[index] !== undefined) {
				parent.children[index].before(element)
			} else {
				parent.append(element)
			}
		}

		// Функция получения индекса внутри родителя
		indexInParent(parent, element) {
			return [...parent.children].indexOf(element)
		}

		// Функция сортировки массива по breakpoint и place
		// по возрастанию для this.type = min
		// по убыванию для this.type = max
		arraySort(arr) {
			if (this.type === 'min') {
				arr.sort((a, b) => {
					if (a.breakpoint === b.breakpoint) {
						if (a.place === b.place) {
							return 0
						}
						if (a.place === 'first' || b.place === 'last') {
							return -1
						}
						if (a.place === 'last' || b.place === 'first') {
							return 1
						}
						return 0
					}
					return a.breakpoint - b.breakpoint
				})
			} else {
				arr.sort((a, b) => {
					if (a.breakpoint === b.breakpoint) {
						if (a.place === b.place) {
							return 0
						}
						if (a.place === 'first' || b.place === 'last') {
							return 1
						}
						if (a.place === 'last' || b.place === 'first') {
							return -1
						}
						return 0
					}
					return b.breakpoint - a.breakpoint
				})
				return
			}
		}
	}

	let da = new DynamicAdapt('max');
	da.init();
}

dynamicAdaptiv()

// slider age

const ageSlider = document.getElementById('age-slider');
if (ageSlider) {
	const valueDisplay = document.getElementById('age-slider-value');
	const minVal = 25;
	const maxVal = 80;


	noUiSlider.create(ageSlider, {
		start: 35,
		connect: 'lower',
		step: 1,
		range: {
			'min': minVal,
			'max': maxVal
		}
	});

	document.getElementById('age-slider-min').textContent = minVal;
	document.getElementById('age-slider-max').textContent = maxVal;

	ageSlider.noUiSlider.on('update', function (values, handle) {
		valueDisplay.textContent = Math.round(values[handle]);
	});
}


// dropdown Menu function
function selectMenu() {
	const selects = document.querySelectorAll('[data-select-menu]');

	// data-select-menu main data-atribute
	// data-select-menu-button open close dropdown menu
	// data-select-menu-value value of data-select-menu-button
	// data-select-menu-drop-down body of dropdown menu
	// data-select-menu-option options of dropdown menu

	if (selects.length) {

		document.documentElement.addEventListener('click', collapseSelects)

		selects.forEach(select => {

			const selectButton = select.querySelector('[data-select-menu-button]');
			const selectOptions = select.querySelectorAll('[data-select-menu-option]');

			selectButton.addEventListener('click', selectToggle)
			selectOptions.forEach(el => {
				el.addEventListener('click', selectChoose)
			});
		});



		function selectToggle(e) {
			const parent = e.target.closest('[data-select-menu]'),
				selectBody = parent.querySelector('[data-select-menu-drop-down]');
			parent.classList.toggle('_active')
			_slideToggle(selectBody, 300)
		}

		function selectChoose(e) {

			
			const parents = document.querySelectorAll('[data-select-menu]');
			parents.forEach(parent => {
				const selectValue = parent.querySelector('[data-select-menu-value]'),
				selectBody = parent.querySelector('[data-select-menu-drop-down]'),
				selectOption = parent.querySelector('[data-select-menu-option]');
				
				let prevValue = selectValue.textContent
				let nextValue = selectOption.textContent
				selectValue.textContent = nextValue
				selectOption.textContent = prevValue
			parent.classList.remove('_active')
			_slideUp(selectBody, 300)
			});
				
			
		}

		function collapseSelects(e) {
			const targetClick = e.target.closest('[data-select-menu]')
			selects.forEach(select => {
				if (!targetClick || targetClick !== select) {
					select.classList.remove('_active')
					const selectBody = select.querySelector('[data-select-menu-drop-down]');
					_slideUp(selectBody, 300)
				}
			});

		}

		let _slideUp = (target, duration = 500) => {
			if (!target.classList.contains('_slide')) {
				target.classList.add('_slide');

				target.style.transitionProperty = 'height, margin, padding';
				target.style.transitionDuration = duration + 'ms';
				target.style.height = target.offsetHeight + 'px';
				target.offsetHeight;
				target.style.overflow = 'hidden';
				target.style.height = 0;
				target.style.paddingTop = 0;
				target.style.paddingBottom = 0;
				target.style.marginTop = 0;
				target.style.marginBottom = 0;
				window.setTimeout(() => {
					target.style.display = 'none';
					target.style.removeProperty('height');
					target.style.removeProperty('padding-top');
					target.style.removeProperty('padding-bottom');
					target.style.removeProperty('margin-top');
					target.style.removeProperty('margin-bottom');
					target.style.removeProperty('overflow');
					target.style.removeProperty('transition-duration');
					target.style.removeProperty('transition-property');
					target.classList.remove('_slide');
				}, duration);
			}
		}

		let _slideDown = (target, duration = 500) => {
			if (!target.classList.contains('_slide')) {
				target.classList.add('_slide');

				target.style.removeProperty('display');
				let display = window.getComputedStyle(target).display;
				if (display === 'none')
					display = 'block'

				target.style.display = display;
				let height = target.offsetHeight;
				target.style.overflow = 'hidden';
				target.style.height = 0;
				target.style.paddingTop = 0;
				target.style.paddingBottom = 0;
				target.style.marginTop = 0;
				target.style.marginBottom = 0;
				target.offsetHeight;
				target.style.transitionProperty = 'height, margin, padding';
				target.style.transitionDuration = duration + 'ms';
				target.style.height = height + 'px';
				target.style.removeProperty('padding-top');
				target.style.removeProperty('padding-bottom');
				target.style.removeProperty('margin-top');
				target.style.removeProperty('margin-bottom');
				window.setTimeout(() => {
					target.style.removeProperty('height');
					target.style.removeProperty('overflow');
					target.style.removeProperty('transition-duration');
					target.style.removeProperty('transition-property');
					target.classList.remove('_slide');
				}, duration);
			}

		}

		let _slideToggle = (target, duration = 500) => {
			if (window.getComputedStyle(target).display === 'none') {
				return _slideDown(target, duration);
			} else {
				_slideUp(target, duration);
			}
		}
	}


}

selectMenu()


// loading 
const durations = [0.5, 0.5, 0.5, 0.5];

function getCoordinatesForPercent(percent, radius) {
	const angle = (percent / 100) * (2 * Math.PI) - Math.PI / 2;
	const x = 50 + radius * Math.cos(angle);
	const y = 50 + radius * Math.sin(angle);
	return [x, y];
}

function updatePie(pathElement, fullCircleElement, percent, radius) {
	if (percent <= 0) {
		pathElement.setAttribute('d', '');
		fullCircleElement.classList.remove('show');
		return;
	}

	if (percent >= 100) {
		pathElement.style.display = 'none';
		fullCircleElement.classList.add('show');
		return;
	}

	const [endX, endY] = getCoordinatesForPercent(percent, radius);
	const largeArcFlag = percent > 50 ? 1 : 0;

	const pathData = `M 50 50 L 50 ${50 - radius} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
	pathElement.setAttribute('d', pathData);
}

function animateRing(ringNumber, radius, durationSeconds) {
	return new Promise((resolve) => {
		const pathElement = document.getElementById(`ring-${ringNumber}`);
		const fullCircleElement = document.getElementById(`full-${ringNumber}`);
		const groupElement = document.getElementById(`group-${ringNumber}`);

		groupElement.classList.add('active');

		let progress = 0;
		const totalSteps = 100;
		const stepTime = (durationSeconds * 1000) / totalSteps;

		const interval = setInterval(() => {
			progress += 1;
			updatePie(pathElement, fullCircleElement, progress, radius);

			if (progress >= 100) {
				clearInterval(interval);
				resolve();
			}
		}, stepTime);
	});
}

async function startCascadeLoader() {
	const processNames = document.querySelectorAll('.loader-form-quize__item');


	processNames[0].classList.add('_loading');
	await animateRing(1, 50, durations[0]);
	processNames[0].classList.add('_active');
	processNames[1].classList.add('_loading');
	await animateRing(2, 30.84, durations[1]);
	processNames[1].classList.add('_active');
	processNames[2].classList.add('_loading');
	await animateRing(3, 19.16, durations[2]);
	processNames[2].classList.add('_active');
	processNames[3].classList.add('_loading');
	await animateRing(4, 11.86, durations[3]);
	processNames[3].classList.add('_active');

	setTimeout(() => {
		const activeSections = document.querySelectorAll('[data-quize-section]._active')

		activeSections.forEach((activeSection, i) => {
			const currentSection = document.querySelectorAll(`[data-quize-section='${Number(activeSection.dataset.quizeSection) + 1}']`)
			activeSection.classList.remove('_active')
			activeSection.classList.remove('_anim')
			currentSection[i].classList.add('_anim')
			currentSection[i].classList.add('_active')
		});
		

	}, 1000);

}




// product page 
function initDayCountdown() {
	const counterElement = document.getElementById('time-counter');
	if (!counterElement) return; 

	function updateCounter() {
		const now = new Date();

		const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);

		const diff = endOfToday - now;

		const hours = Math.floor(diff / (1000 * 60 * 60));
		const minutes = Math.floor((diff / (1000 * 60)) % 60);
		const seconds = Math.floor((diff / 1000) % 60);

		const formattedHours = String(hours).padStart(2, '0');
		const formattedMinutes = String(minutes).padStart(2, '0');
		const formattedSeconds = String(seconds).padStart(2, '0');

		counterElement.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
	}

	updateCounter();

	setInterval(updateCounter, 1000);
}

document.addEventListener('DOMContentLoaded', initDayCountdown);

// tabs function

function filterFunction() {
	const filters = document.querySelectorAll('[data-filter]');

	if (filters) {
		filters.forEach(filter => {
			const filterButtons = filter.querySelectorAll('[data-filter-category]');

			filterButtons.forEach(filterButton => {

				filterButton.addEventListener('click', (e) => {
					let filterSections = filter.querySelectorAll('[data-filter-content]')
					filterSections.forEach(filterSection => {
						if (filterSection.classList.contains('_show')) {
							filterSection.classList.remove('_show')
						}
						if (filterSection.classList.contains('_last-child')) {
							filterSection.classList.remove('_last-child')
						}

					});

					filterButtons.forEach(filterButton => {
						if (filterButton.classList.contains('_active')) {
							filterButton.classList.remove('_active')
						}
					});

					let seflButton = e.target,
						buttonId = seflButton.dataset.filterCategory

					if (buttonId === 'all') {
						filterSections.forEach((filterSection, index) => {
							filterSection.classList.add('_show')
							if (index === filterSections.length - 1) {
								filterSection.classList.add('_last-child')
							}
						});

					} else {
						const sectionsWithRightCategory = document.querySelectorAll(`[data-filter-content="${buttonId}"]`)

						sectionsWithRightCategory.forEach((sectionWithRightCategory, index) => {
							sectionWithRightCategory.classList.add('_show')
							if (index === sectionsWithRightCategory.length - 1) {
								sectionWithRightCategory.classList.add('_last-child')
							}
						});
					}

					seflButton.classList.add('_active')

				})
			});


		});
	}

}

filterFunction()


const animBlock = document.querySelector('[data-scroll-anim]');

if (animBlock) {
	window.addEventListener('scroll', () => {
		const vh100 = window.innerHeight;

		if (window.scrollY >= vh100) {
			animBlock.classList.add('_active');
		} else {
			animBlock.classList.remove('_active'); 
		}
	});
}


//product choose

const productChooses = document.querySelectorAll('[data-product-choose]');

if(productChooses.length){
	productChooses.forEach(productChoose => {
		const productItems = productChoose.querySelectorAll('[data-product-choose-item]');

		productItems.forEach(productItem => {
			productItem.addEventListener('click', (e)=>{
				const activeProduct = productChoose.querySelector('[data-product-choose-item]._active')

				if (activeProduct !== productItem){
					activeProduct.classList.remove('_active')
					productItem.classList.add('_active')
					
				}

			})
		});
	});
}