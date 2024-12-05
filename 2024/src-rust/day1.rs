pub fn star1() {
    let input: &str = include_str!("./day1/input.txt");
    let arr: vec![i32] = [];
    input.chars().for_each(|c| {
        print!("{}", c);
        match c.to_digit(10) {
            None => Err(()),
            Some(d) => arr.push(d as i32),
        }
    });
}
