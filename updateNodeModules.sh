#!/bin/zsh

directory1="node_modules/@vendure/core/dist/config"
string1="Ingrese manualmente los detalles de cumplimiento"

if ! grep -rq $string1 $directory1; then
find $directory1 -type f -exec sed -i 's/\[{ languageCode: generated_types_1.LanguageCode.en, value: '\''Manually enter fulfillment details'\'' }\]/\[ { languageCode: generated_types_1.LanguageCode.en, value: '\''Manually enter fulfillment details'\'' }, { languageCode: generated_types_1.LanguageCode.es, value:  '\'$string1\'' } \]/g' {} +
fi
