$(() => {
  if ($('textarea#ta').length) {
    CKEDITOR.replace('ta');
  }

  $('a.confirm-deletion').on('click', () => {
    if (!confirm('Confirm Deletion?')) return false;
  });
});
