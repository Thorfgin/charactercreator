[![CI/CD Master](https://github.com/Thorfgin/charactercreator/actions/workflows/node.js.yml/badge.svg)](https://github.com/Thorfgin/charactercreator/actions/workflows/node.js.yml)
![License](https://img.shields.io/github/license/Thorfgin/charactercreator)

	=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

	TODO:

	MUST
	- FIX: change the way skills are selected, by referencing id instead of skill.
	Skills may no be unique in name, for example 'extra wilskracht' exists twice in ExtraVaardigheden
	This may cause issues with the saves, because everything is reference by skillname.
	
	- FIX: Chromium browser compatibility
	TEST 

	SHOULD:
	- FEATURE: Extend the character with a NOTE section to allow players to register remarks, powers/conditions, etc.
	- LANGUAGE: add English as an option

	COULD:
	- PREREQUISITES: add all single-tree prerequisite skills that have are listed as a prerequisite.
	- PREREQUISITES: add button to remove all skills that have it as a prerequisite.
	
	WOULD: 
	- integration with VOIDWALKER / create new characters
		> this requires integration on perhaps an API level
		> Needs to be done from within a player portal? Probably requires a Node.js server


	PLAYER REQURESTS:
	> UNDER REVIEW: Als ik een skill wil toevoegen die niet mag (bijvoorbeeld een c skill zonder de B) dan wordt mij niet verteld WAAROM het niet mag.
	> UNDER REVIEW: De standaard templates knop zou wel iets groter mogen, deze is nu bijna onzichtbaar  (2x)
	
	> APPROVED: Het zou fijn zijn, als je een vaardigheid pakt met hele duidelijke prereqs, zoals Harnas 3, dat hij je dan automatisch Harnas 1 en 2 geeft.
	
	> DCELINED: Powers & Conditions beschikbaar maken bij characters. 

	=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

	DONE
	20240416	FIX: Kennis van Kruiden inspirition adjusted 3 to 2 inspiration.
				FIX: Max saved XP cap raised from 2 to 3.
			FIX: Size of the Recipy panel adjusted so "Minor potion of inspiration of the magi" fits.
			FIX: Changed the info panel for Spells to show Energy instead of Mana.

	20231106	PRESETS: add a generic text and description per preset explaing the general style of play 
				for this type of character on Vortex Adventure
			NEWCHAR: expand the XP warning with a explainatory text on skill shuffle for new players.	
			FIX: Again faulty scaling based of the image Character Eigenschappen based on current screen dimensions	
			UNITTEST: improved unittests for vaardigheden.json to cross-reference Spells, Recipes, Requirements
			UNITTEST: add unittests for presets.json 
			UNITTEST: add unittests for releasenotes.json

	20231101	VERSION: when clicking the version, show a modal with the release notes.
			MIN-XP: When a build has spend less than 13 points, show a warning next to XP remaining that XP will be lost.
			FRAMEWORK: Reworked the Tooltips to be less convoluted and more maintainable
			FIX: minor bug in Presets, causing a single preset not to load.
			FIX: faulty scaling based of the image Character Eigenschappen based on current screen dimensions
			FIX: Adding a Skill to the Select, than loading a preset (or save) does not clear Select.
			  This results in the skill being added twice.
			FIX: on loading a character the new Character check was nog set propperly after refactoring
			FIX: fixed a faulty spell name
			LOOKS/FEELS: Changed the NewCharacter toggle, it will no longer erase when unchecking the checkbox,
			unless and Extra skill was added. If that is the case it will be erased entirely still.


	20231028	FRAMEWORK: When a json is updated, old characters do not reload their skills 
			on a load (localstorage) or import (datafile). Instead, old data is loaded causing failures 
			in the code. This requires a conversion of the current way to save characters.
			CHARNAME: when refreshing or reloading the page, the name of the character is now restored

	20231026	FIX BUG: When adding a skill with the + while at MAX XP will still allow adding the skill somehow.
			PDF EXPORT: Export the character overview as a PDF, for easy use at the event.

	20231018	FRAMEWORK: Decoupled components and seperated dataobjects to a seperated context.

	20231012	PRESETS: Ability to load a preset-character
			ARTIFACT: the CI/CD yields an artifact for sharing convenience.
			Bugfix: fixed negative XP remaining

	20231011	UNITTESTING: Reinstated. Added coverage logging.
			FAQ: added a FAQ page to answer some common questions
			LOCALSTORAGE: Extended the save/load buttons with confirm messages
			Fixed some minor issues.

	20231005	FRAMEWORK: Major overhaul to deal with security risks
			UNITTESTING: Have been temporarily disabled untill deployments work properly
			BUGREPORT: removed the option, in favor of SENTRY implementation

	20231004	RULESET_VERSION: futureproofing - added support to check on the ruleset version.
			generic fixes: seperated some components and functions for maintainability
			EXPORT BUILD: Export the current skillset into a downloadable file
			IMPORT BUILD: Import a local file and set it as the current skillset
			LOCALSTORAGE: Store a character under its own name. Make it reloadable by a pick-list
			LOCALSTORAGE: obfuscated the data, to somewhat prevent tinkering
			BUGREPORT: added option to report bugs

	20231004	RULESET_VERSION: futureproofing - added support to check on the ruleset version.
			generic fixes: seperated some components and functions for maintainability
			EXPORT BUILD: Export the current skillset into a downloadable file
			IMPORT BUILD: Import a local file and set it as the current skillset
			LOCALSTORAGE: Store a character under its own name. Make it reloadable by a pick-list
			LOCALSTORAGE: obfuscated the data, to somewhat prevent tinkering
			BUGREPORT: added option to report bugs

	20231001	LOCALSTORAGE: the latest build data is stored the localstorage

	20230928	bugfixes: fixed some minor inconsistencies
			- added special prereq to teacher expertise in tooltip
			- fixed check on extra skills for ritualism
	
	20230927	LORESHEET: column contains an actual link to the loresheet itself
			TABLE: columns are sortable by clicking the header
			TABLE: Drag and Drop in the skill table, as method of rearranging items

	20230926	SELECT: INFO next to the Select should INDICATE based on meeting pre-reqs
				(SIZE, COLOR, ANIMATION, ETC)
			WONT DO: Change Error messages (modals) to a (!) img with mouseover.
			This is done already above, as the only messages/modals are shown when adding/removing items.
			Removing has no valid option to show another (!).
			XP: add a reverse counter to show the ammount of free xp.


	20230924	SPELL: Add a PDF Source/Page reference to each GridItem
			SKILL: Add a PDF Source/Page reference to each row
			feature: Added and exception clause so certain skills are alllowed to bypass prerequisites
			bugfixes: fixed some inconsistencies in the skills, causing minor bugs

	20230922	REFACTOR: Major overhaul and seperation of functionality into functions for maintainability
			UNITTESTING: Added __test__ folder and implemented unittesting on prerequisites
			SELECT: Upgraded Select to add on an Enter, and blank on Escape
			bugfixes: several minor bugs in the prerequisites were fixed.

	20230920	Major upgrade, all extra skills have been added.
			Several prerequisite checks have been updated.
			PREQUISITES: added option to select a category and XP value

	20230918	SELECT: customized the Selects to show a tooltip with the Skill description


	20230917	SKILL: ExtraSkill selection
			SKILL: ExtraSkill removal
			PREREQUISITES: Extend check on pre-requisites with ExtraSkill
			XP: Set a custom MAX_XP

	20230914	GRID CHAR PROPERTIES Each block should have an image	
			SELECT: Added XP cost to each skill label
			Created CI/CD to build and deploy to GitHub Pages:
			https://thorfgin.github.io/charactercreator/

	20230913	PREREQUISITES: check for prerequisistes to prevent invalid selection of skills 
			PREREQUISITES: stop removing of a skill when other skills are dependant on it as requirement
			SKILLS: Tooltip is properly formatted and shows the right content.
	
	20230912	SKILLS have Tooltips available
	

	20230911	SPELLS/RECIPES can be converted to JSON per script
	
	20230908	SPELLS/RECIPES have tooltips
	

	20230905	RECIPY gives a summary of the selected spells aquired by skills
			SPELLS & TECHNIQUE gives a summary of the selected spells aquired by skills
			RESET: button on TOP reset the Character Creator, clears all tables.
	
	20230901	Character properties are added/subtracted on the selection of sklls
			if already present, than numeric values are adjusted accordinly. 
			JSON should contain the relevant properties under 'Eigenschappen':
				"Eigenschappen": {
					"hitpoints": 0,
					"armourpoints": 0,
					"elemental_mana": 0,
					"elemental_ritual_mana": 0,
					"spiritual_mana": 0,
					"spiritual_ritual_mana": 0,
					"inspiration": 0,
					"willpower": 0,
					"glyph_cap": 0,
					"glyph_imbue_cap": 0,
					"rune_cap": 0,
					"rune_imbue_cap": 0
				  }
