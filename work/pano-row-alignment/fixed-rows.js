// Author: @Jhih he
(function () {
    if (!location.pathname.includes('/houseadmin/pano/image.html')) return;
    let pending = false;
    const observed = new WeakSet();
    const resize = new ResizeObserver(schedule);
    function schedule() {
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => { pending = false; sync(); });
    }
    function sync() {
        document.querySelectorAll('.layui-table-view').forEach(view => {
            const main = view.querySelector('.layui-table-main');
            if (!main) return;
            main.querySelectorAll('tr[data-index]').forEach(row => {
                if (!observed.has(row)) { resize.observe(row); observed.add(row); }
                const height = row.getBoundingClientRect().height;
                if (!height) return;
                view.querySelectorAll('.layui-table-fixed .layui-table-body tr[data-index]').forEach(copy => {
                    if (copy.dataset.index !== row.dataset.index) return;
                    const value = `${height}px`;
                    if (copy.style.height !== value) copy.style.height = value;
                    copy.querySelectorAll('td').forEach(cell => {
                        cell.style.boxSizing = "border-box";
                        if (cell.style.height !== value) cell.style.height = value;
                    });
                });
            });
        });
    }
    new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener('resize', schedule);
    document.addEventListener('load', schedule, true);
    schedule();
})();
