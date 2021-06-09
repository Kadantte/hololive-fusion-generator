const customNames = require("./customNames.json");
const talent = require("./talent");

const nameType = {
	LAST_NAME: "lastName",
	FIRST_NAME: "firstName"
};

function changeFirstCharToUppercase(string) {
	return string[0].toUpperCase() + string.slice(1);
}

function isLastCharOfStr1SameAsFirstCharOfStr2(string1, string2) {
	return string1.slice(-1).toLowerCase() === string2[0].toLowerCase();
}

function removeLastCharOfString(string) {
	return string.slice(0, -1);
}

function getTalentFullName(talent) {
	return {
		lastName: changeFirstCharToUppercase(talent.lastName),
		firstName: changeFirstCharToUppercase(talent.firstName)
	};
}

function getTalentFullNameById(talentId) {
	return getTalentFullName(talent.getTalentById(talentId));
}

function concatStringWithoutSameCharInMiddle(string1, string2) {
	if (isLastCharOfStr1SameAsFirstCharOfStr2(string1, string2))
		return removeLastCharOfString(string1) + string2;
	return string1 + string2;
}

function fuseTalentNamesOfSameType(talent1, talent2, nameType) {
	const talent1Name = talent1[nameType];
	const talent2Name = talent2[nameType];
	const nameBefore = talent1[nameType + "Before"];
	const nameAfter = talent2[nameType + "After"];
	const fusion = concatStringWithoutSameCharInMiddle(nameBefore, nameAfter);
	if (fusion === talent1Name || fusion === talent2Name) {
		return changeFirstCharToUppercase(
			concatStringWithoutSameCharInMiddle(nameBefore, talent2Name)
		);
	}
	return changeFirstCharToUppercase(fusion);
}

function fuseTalentNamesOfSameTypeEvenIfMissing(talent1, talent2, nameType) {
	if (talent1[nameType] && talent2[nameType])
		return fuseTalentNamesOfSameType(talent1, talent2, nameType);
	const name = talent1[nameType] || talent2[nameType];
	if (name)
		return changeFirstCharToUppercase(name);
}

function getNameTupleString(talent1, talent2) {
	const talentId1 = talent.getTalentId(talent1);
	const talentId2 = talent.getTalentId(talent2);
	return talentId1 + " " + talentId2;
}

function getCustomName(talent1, talent2) {
	const nameTupleString = getNameTupleString(talent1, talent2);
	if (nameTupleString in customNames)
		return customNames[nameTupleString];
}

function fuseTalentFullNames(talent1, talent2) {
	if (talent1 === talent2)
		return getTalentFullName(talent1);
	const customName = getCustomName(talent1, talent2);
	if (customName)
		return customName;
	return {
		lastName: fuseTalentNamesOfSameTypeEvenIfMissing(talent1, talent2, nameType.LAST_NAME),
		firstName: fuseTalentNamesOfSameTypeEvenIfMissing(talent1, talent2, nameType.FIRST_NAME)
	};
}

function fuseTalentFullNamesById(id1, id2) {
	return fuseTalentFullNames(
		talent.getTalentById(id1),
		talent.getTalentById(id2)
	);
}

function returnUndefinedStringOrArgument(string) {
	return string || "undefined";
}

function getFullNameString(talentOrFullName) {
	const fullNameString = [];
	for (const nameType of ["lastName", "firstName"]) {
		if (talentOrFullName[nameType])
			fullNameString.push(changeFirstCharToUppercase(talentOrFullName[nameType]));
	}
	return fullNameString.join(" ");
}

function getFullNameStringDebug(talentOrFullName) {
	const fullNameString =
		changeFirstCharToUppercase(returnUndefinedStringOrArgument(talentOrFullName.lastName))
		+ " "
		+ changeFirstCharToUppercase(returnUndefinedStringOrArgument(talentOrFullName.firstName));
	return fullNameString;
}

function getFullNameStringById(id) {
	return getFullNameString(talent.getTalentById(id));
}

// function getFullNameStringByIdDebug(id) {
// 	return getFullNameStringDebug(talent.getTalentById(id));
// }

function getFusionStringByIds(id1, id2) {
	return getFullNameString(fuseTalentFullNamesById(id1, id2));
}

function getVariationsTwoTalents(talent1, talent2) {
	const variations = [
		{
			talent1: talent1,
			talent2: talent2,
			fusion: fuseTalentFullNames(talent1, talent2)
		},
		{
			talent1: talent2,
			talent2: talent1,
			fusion: fuseTalentFullNames(talent2, talent1)
		}
	];
	return variations;
}

function getAllNameVariations() {
	const nameVariations = [];
	const talentIds = talent.getTalentIdsAll();
	for (let i = 0; i < talentIds.length; i++) {
		for (let j = i + 1; j < talentIds.length; j++) {
			const talent1 = talent.getTalentById(talentIds[i]);
			const talent2 = talent.getTalentById(talentIds[j]);
			nameVariations.push(...getVariationsTwoTalents(talent1, talent2));
		}
	}
	return nameVariations;
}

function getAllNameVariationsForTalent(talentId) {
	const nameVariations = [];
	const talentIds = talent.getTalentIdsAll();
	for (const currentId of talentIds) {
		if (talentId === currentId)
			continue;
		const talent1 = talent.getTalentById(talentId);
		const talent2 = talent.getTalentById(currentId);
		nameVariations.push(...getVariationsTwoTalents(talent1, talent2));
	}
	return nameVariations;
}

function printNameFusionFormatted(talent1, talent2, fullName) {
	const talent1FullName = getFullNameStringDebug(talent1);
	const talent2FullName = getFullNameStringDebug(talent2);
	const fusionFullName = getFullNameStringDebug(fullName);
	console.log(talent1FullName + " + " + talent2FullName + " = " + fusionFullName);
}

function printAllNameVariations() {
	const variations = getAllNameVariations();
	for (const variation of variations) {
		printNameFusionFormatted(variation.talent1, variation.talent2, variation.fusion);
	}
}

function printAllNameVariationsForTalent(talentId) {
	const variations = getAllNameVariationsForTalent(talentId);
	for (const variation of variations) {
		printNameFusionFormatted(variation.talent1, variation.talent2, variation.fusion);
	}
}

module.exports = {
	fuseTalentFullNames,
	fuseTalentFullNamesById,
	getAllNameVariations,
	getAllNameVariationsForTalent,
	getFullNameString,
	getFullNameStringById,
	getFusionStringByIds,
	getTalentFullName,
	getTalentFullNameById,
	printAllNameVariations,
	printAllNameVariationsForTalent
};
