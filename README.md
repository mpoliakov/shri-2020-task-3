# Задание 3. Найдите ошибки

#### Исправленные ошибки:

- Ошибки компиляции в server.ts ([commit](https://github.com/mpoliakov/shri-2020-task-3/commit/9a4dc050ccc851fcae3800ceed389d89728edb6c#diff-916156c481141bfcd08c6ae40ce10e00));
- Удалил неиспользуемые файлы hash.ts и jsonMain.ts ([commit](https://github.com/mpoliakov/shri-2020-task-3/commit/b3e24e74ae1d61a564e2e2520b97ba671f5f9512));
- Исправил отображение preview при запуске плагина extension.ts ([commit](https://github.com/mpoliakov/shri-2020-task-3/commit/ba37f389a7287574b344258bc39982771c314ada#diff-45327f86d4438556066de133327f4ca2));
- Исправил путь до css-стилей в preview/index.html ([commit](https://github.com/mpoliakov/shri-2020-task-3/commit/af00318216fb283c14e29e789dd84fd86ac6abfa#diff-274a1e6fb043a4f561e619b11c706ad3));
- Исправил чтение json-файла при редактировании: вычитывалась сохранённая версия файла, а не текущие изменения ([commit](https://github.com/mpoliakov/shri-2020-task-3/commit/dcf1ae8096777fd1a84afaddaed619ae58ccea07#diff-916156c481141bfcd08c6ae40ce10e00));
- Исправил отображение сообщений в Problems ([commit](https://github.com/mpoliakov/shri-2020-task-3/commit/251a8bf4082e7f92c11703120b14336e187dc368#diff-105a25db2fd03476fc2d5672bc256a8c));
- При исправлении всех ошибок надо очищать Problems ([commit](https://github.com/mpoliakov/shri-2020-task-3/commit/792de3429c6e2df99b2274badf77dc7cdf2ca716#diff-916156c481141bfcd08c6ae40ce10e00));
- При закрытии файла надо очищать Problems для данного файла ([commit](https://github.com/mpoliakov/shri-2020-task-3/commit/e4801d85b1c528be26ff78f804e0ea9d6eb3583a#diff-916156c481141bfcd08c6ae40ce10e00));
- Исправил определение DiagnosticSeverity.Error (было Information) ([commit](https://github.com/mpoliakov/shri-2020-task-3/commit/5ae32c14fb011f77b2397e7b34e7661e2f7bcc06#diff-916156c481141bfcd08c6ae40ce10e00));
- Удалил комментарии из json-файлов, формат json не поддерживает комментарии ([commit](https://github.com/mpoliakov/shri-2020-task-3/commit/46c82ba729841563cc6778c148bf10b4717676bd#diff-24c73412592dac9d8b9a739107c2c905));
